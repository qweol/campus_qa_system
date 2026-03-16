"""
混合检索版本：向量检索 + BM25关键词检索
升级说明：解决时间敏感和专有名词匹配问题
"""
from __future__ import annotations

import json
from typing import Any, AsyncIterator

from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.retrievers import BM25Retriever
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_core.documents import Document

from app.config import settings

_PROMPT_TEMPLATE = """你是一位友善的校园智能问答助手，服务于在校师生。

请按照以下逻辑处理用户的输入：

【情况一：闲聊 / 问候 / 感谢 / 与校园无关的通用问题】
直接用自然、友好的语气回应，不需要引用知识库，也不要说"未找到依据"。

【情况二：校园相关问题（教务、课程、图书馆、考试、选课、政策等）】
优先基于下方"检索到的上下文"回答。
- 如果上下文包含相关信息，给出准确、简洁的回答。
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


def _load_documents_for_bm25():
    """加载文档用于BM25检索"""
    loader = DirectoryLoader(
        settings.docs_path,
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"}
    )
    return loader.load()


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


class HybridRetriever:
    """手动实现的混合检索器"""
    def __init__(self, vector_retriever, bm25_retriever, weights=(0.7, 0.3)):
        self.vector_retriever = vector_retriever
        self.bm25_retriever = bm25_retriever
        self.weights = weights

    def invoke(self, query: str) -> list[Document]:
        """混合检索：向量 + BM25"""
        # 向量检索
        vector_docs = self.vector_retriever.invoke(query)

        # BM25检索
        bm25_docs = self.bm25_retriever.invoke(query)

        # 简单合并去重（基于内容）
        seen_content = set()
        merged_docs = []

        # 先加入向量检索结果（权重更高）
        for doc in vector_docs:
            content_hash = hash(doc.page_content[:100])
            if content_hash not in seen_content:
                seen_content.add(content_hash)
                merged_docs.append(doc)

        # 再加入BM25结果
        for doc in bm25_docs:
            content_hash = hash(doc.page_content[:100])
            if content_hash not in seen_content:
                seen_content.add(content_hash)
                merged_docs.append(doc)

        return merged_docs[:6]  # 返回Top 6


def build_hybrid_rag_chain() -> tuple[Any, Any]:
    """
    构建混合检索RAG链
    返回 (chain, retriever)
    """
    # 向量检索器
    vectorstore = _load_vectorstore()
    vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 6})

    # BM25关键词检索器
    docs = _load_documents_for_bm25()
    bm25_retriever = BM25Retriever.from_documents(docs)
    bm25_retriever.k = 6

    # 混合检索器
    hybrid_retriever = HybridRetriever(vector_retriever, bm25_retriever)

    prompt = PromptTemplate.from_template(_PROMPT_TEMPLATE)
    llm = _make_llm()

    chain = (
        {"context": RunnableLambda(hybrid_retriever.invoke) | _format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain, hybrid_retriever


def ask_question(chain: Any, retriever: Any, question: str) -> dict[str, Any]:
    """同步调用，返回完整回答和来源文档"""
    docs = retriever.invoke(question)
    answer = chain.invoke(question)
    sources = [
        {"source": doc.metadata.get("source", "unknown"), "title": doc.metadata.get("title", "")}
        for doc in docs
    ]
    return {"answer": answer, "sources": sources}


async def stream_qa(chain: Any, retriever: Any, question: str) -> AsyncIterator[str]:
    """异步流式生成器"""
    docs = retriever.invoke(question)
    async for chunk in chain.astream(question):
        yield chunk

    sources = [
        {"source": doc.metadata.get("source", "unknown"), "title": doc.metadata.get("title", "")}
        for doc in docs
    ]
    yield "\n\n__SOURCES__:" + json.dumps(sources, ensure_ascii=False)
