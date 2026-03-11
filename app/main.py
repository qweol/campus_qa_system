from __future__ import annotations

import json
import shutil
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.config import settings
from app.rag import ask_question, build_rag_chain, stream_qa

rag_chain = None
retriever = None

UPLOAD_DIR = Path("data/uploads")


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, description="用户问题")


class SourceItem(BaseModel):
    source: str
    title: str = ""


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceItem]


@asynccontextmanager
async def lifespan(_: FastAPI):
    global rag_chain, retriever
    try:
        rag_chain, retriever = build_rag_chain()
    except Exception as _e:
        import traceback
        traceback.print_exc()
        rag_chain = None
        retriever = None
    yield


app = FastAPI(title="校园智能问答 API", version="0.2.0", lifespan=lifespan)


def _check_ready() -> None:
    if rag_chain is None or retriever is None:
        raise HTTPException(
            status_code=503,
            detail="问答服务未就绪：请先配置 .env 并执行 python scripts/build_index.py 构建知识库索引。",
        )


@app.get("/health")
def health() -> dict[str, str]:
    ready = rag_chain is not None
    return {"status": "ok", "qa_ready": str(ready).lower()}


@app.post("/chat", response_model=ChatResponse)
def chat(body: ChatRequest) -> ChatResponse:
    _check_ready()
    result = ask_question(rag_chain, retriever, body.question)
    return ChatResponse(answer=result["answer"], sources=result["sources"])


@app.post("/chat/stream")
async def chat_stream(body: ChatRequest) -> StreamingResponse:
    _check_ready()

    async def event_generator():
        try:
            async for chunk in stream_qa(rag_chain, retriever, body.question):
                # 最后一段是来源 JSON，原样推送让前端解析
                data = chunk.replace("\n", "\\n")
                yield f"data: {data}\n\n"
        except Exception as exc:
            yield f"data: __ERROR__:{exc}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> dict[str, str]:
    """上传文档文件（PDF / MD / TXT），增量写入向量库。"""
    suffix = Path(file.filename).suffix.lower()
    if suffix not in {".pdf", ".md", ".txt"}:
        raise HTTPException(status_code=400, detail="仅支持 .pdf / .md / .txt 文件")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = UPLOAD_DIR / file.filename
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    # 增量入库
    try:
        from langchain_community.document_loaders import PyPDFLoader, TextLoader
        from langchain_community.vectorstores import FAISS
        from langchain_openai import OpenAIEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        if suffix == ".pdf":
            loader = PyPDFLoader(str(dest))
        else:
            loader = TextLoader(str(dest), encoding="utf-8")

        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=80,
            separators=["\n\n", "\n", "。", "，", " ", ""],
        )
        chunks = splitter.split_documents(docs)

        embeddings = OpenAIEmbeddings(
            model=settings.embedding_model,
            api_key=settings.openai_api_key,
            base_url=settings.openai_base_url,
        )
        index_path = Path(settings.vector_db_path)

        if index_path.exists():
            vs = FAISS.load_local(str(index_path), embeddings, allow_dangerous_deserialization=True)
            vs.add_documents(chunks)
        else:
            vs = FAISS.from_documents(chunks, embeddings)
            index_path.parent.mkdir(parents=True, exist_ok=True)

        vs.save_local(str(index_path))

        # 热更新内存中的 retriever
        global rag_chain, retriever
        if retriever is not None:
            from app.rag import build_rag_chain
            rag_chain, retriever = build_rag_chain()

    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"入库失败：{exc}") from exc

    return {"status": "ok", "filename": file.filename, "chunks": str(len(chunks))}
