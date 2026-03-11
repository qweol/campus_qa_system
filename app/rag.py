from __future__ import annotations

import json
from typing import Any, AsyncIterator

from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from app.config import settings

_PROMPT_TEMPLATE = """你是一位友善的校园智能问答助手，服务于在校师生。

请按照以下逻辑处理用户的输入：

【情况一：闲聊 / 问候 / 感谢 / 与校园无关的通用问题】
直接用自然、友好的语气回应，不需要引用知识库，也不要说"未找到依据"。
例如："你好" → "你好！有什么我可以帮你的吗？😊"

【情况二：校园相关问题（教务、课程、图书馆、考试、选课、政策等）】
优先基于下方"检索到的上下文"回答。
- 如果上下文包含相关信息，给出准确、简洁的回答，并可适当补充建议。
- 如果上下文与问题完全不相关或为空，说明："这个问题我暂时没有找到相关资料，建议直接联系教务处或相关部门咨询。"
- 不要编造学院名称、具体日期、政策细节。

检索到的上下文：
{context}

用户问题：
{question}

回答："""


def _load_vectorstore() -> FAISS:
    embeddings = OpenAIEmbeddings(
        model=settings.embedding_model,
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
    )
    return FAISS.load_local(
        settings.vector_db_path,
        embeddings,
        allow_dangerous_deserialization=True,
    )


def _make_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.llm_model,
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
        temperature=0.1,
        streaming=True,
    )


def _format_docs(docs: list) -> str:
    return "\n\n".join(doc.page_content for doc in docs)


def build_rag_chain() -> tuple[Any, Any]:
    """返回 (chain, retriever)，chain 为 LCEL 流式链。"""
    vectorstore = _load_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    prompt = PromptTemplate.from_template(_PROMPT_TEMPLATE)
    llm = _make_llm()

    chain = (
        {"context": retriever | _format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain, retriever


def ask_question(chain: Any, retriever: Any, question: str) -> dict[str, Any]:
    """同步调用，返回完整回答和来源文档。"""
    docs = retriever.invoke(question)
    answer = chain.invoke(question)
    sources = [
        {"source": doc.metadata.get("source", "unknown"), "title": doc.metadata.get("title", "")}
        for doc in docs
    ]
    return {"answer": answer, "sources": sources}


async def stream_qa(chain: Any, retriever: Any, question: str) -> AsyncIterator[str]:
    """
    异步流式生成器。
    先推送 token 文本块，最后推送一个 JSON 行：{"sources": [...]}
    """
    docs = retriever.invoke(question)
    async for chunk in chain.astream(question):
        yield chunk

    sources = [
        {"source": doc.metadata.get("source", "unknown"), "title": doc.metadata.get("title", "")}
        for doc in docs
    ]
    yield "\n\n__SOURCES__:" + json.dumps(sources, ensure_ascii=False)
