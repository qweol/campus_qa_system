"""
混合检索版本：向量检索 + BM25关键词检索
升级说明：解决时间敏感和专有名词匹配问题
V2.1优化：加入相似度阈值过滤、BM25缓存、真正的加权融合、检索日志
"""
from __future__ import annotations

import json
import time
import logging
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

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# 全局缓存
_vectorstore = None
_bm25_retriever = None


def _load_vectorstore() -> FAISS:
    global _vectorstore
    if _vectorstore is None:
        embeddings = OpenAIEmbeddings(
            model=settings.embedding_model,
            api_key=settings.openai_api_key,
            base_url=settings.openai_base_url,
        )
        _vectorstore = FAISS.load_local(
            settings.vector_db_path,
            embeddings,
            allow_dangerous_deserialization=True,
        )
        logger.info("向量数据库加载完成")
    return _vectorstore


def _get_bm25_retriever() -> BM25Retriever:
    """获取BM25检索器（带缓存）"""
    global _bm25_retriever
    if _bm25_retriever is None:
        loader = DirectoryLoader(
            settings.docs_path,
            glob="**/*.md",
            loader_cls=TextLoader,
            loader_kwargs={"encoding": "utf-8"}
        )
        docs = loader.load()
        _bm25_retriever = BM25Retriever.from_documents(docs)
        _bm25_retriever.k = 10
        logger.info(f"BM25检索器初始化完成，文档数：{len(docs)}")
    return _bm25_retriever


def _make_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.llm_model,
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
        temperature=0.1,
        streaming=True,
    )


def _format_docs(docs: list) -> str:
    if not docs:
        return ""
    return "\n\n".join(doc.page_content for doc in docs)


def _normalize_scores(scores: list[float]) -> list[float]:
    """归一化分数到0-1"""
    if not scores or max(scores) == min(scores):
        return [1.0] * len(scores)
    min_score = min(scores)
    max_score = max(scores)
    return [(s - min_score) / (max_score - min_score) for s in scores]


class HybridRetriever:
    """混合检索器：向量检索 + BM25，带加权融合和阈值过滤"""
    
    def __init__(self, vectorstore: FAISS, bm25_retriever: BM25Retriever, 
                 weights=(0.7, 0.3), similarity_threshold=0.5):
        self.vectorstore = vectorstore
        self.bm25_retriever = bm25_retriever
        self.weights = weights
        self.similarity_threshold = similarity_threshold

    def invoke(self, query: str) -> list[Document]:
        """混合检索：向量 + BM25，加权融合"""
        start_time = time.time()
        
        # 向量检索（带分数）
        vector_start = time.time()
        vector_results = self.vectorstore.similarity_search_with_score(query, k=10)
        vector_time = time.time() - vector_start
        
        # 相似度阈值过滤
        filtered_vector = [(doc, score) for doc, score in vector_results if score < self.similarity_threshold]
        
        if not filtered_vector:
            logger.warning(f"向量检索无相关结果（阈值={self.similarity_threshold}）")
            return []
        
        # BM25检索
        bm25_start = time.time()
        bm25_docs = self.bm25_retriever.invoke(query)
        bm25_time = time.time() - bm25_start
        
        # 加权融合
        final_scores = {}
        
        # 向量检索结果（FAISS距离越小越相似，需要转换）
        vector_scores = [1 / (1 + score) for doc, score in filtered_vector]
        vector_scores_norm = _normalize_scores(vector_scores)
        
        for (doc, _), norm_score in zip(filtered_vector, vector_scores_norm):
            doc_key = doc.page_content[:100]
            final_scores[doc_key] = {
                "doc": doc,
                "score": self.weights[0] * norm_score
            }
        
        # BM25结果（需要获取分数）
        if bm25_docs:
            bm25_scores = self.bm25_retriever.get_scores(query)[:len(bm25_docs)]
            bm25_scores_norm = _normalize_scores(bm25_scores)
            
            for doc, norm_score in zip(bm25_docs, bm25_scores_norm):
                doc_key = doc.page_content[:100]
                if doc_key in final_scores:
                    final_scores[doc_key]["score"] += self.weights[1] * norm_score
                else:
                    final_scores[doc_key] = {
                        "doc": doc,
                        "score": self.weights[1] * norm_score
                    }
        
        # 按最终分数排序
        sorted_results = sorted(final_scores.values(), key=lambda x: x["score"], reverse=True)
        final_docs = [item["doc"] for item in sorted_results[:6]]
        
        total_time = time.time() - start_time
        logger.info(
            f"检索完成 | 总耗时:{total_time:.3f}s | 向量:{vector_time:.3f}s({len(filtered_vector)}条) | "
            f"BM25:{bm25_time:.3f}s({len(bm25_docs)}条) | 最终:{len(final_docs)}条"
        )
        
        return final_docs


def build_hybrid_rag_chain() -> tuple[Any, Any]:
    """
    构建混合检索RAG链
    返回 (chain, retriever)
    """
    vectorstore = _load_vectorstore()
    bm25_retriever = _get_bm25_retriever()
    
    hybrid_retriever = HybridRetriever(
        vectorstore=vectorstore,
        bm25_retriever=bm25_retriever,
        weights=(0.7, 0.3),
        similarity_threshold=0.5
    )

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
    
    if not docs:
        return {
            "answer": "这个问题我暂时没有找到相关资料，建议直接联系教务处或相关部门咨询。",
            "sources": []
        }
    
    answer = chain.invoke(question)
    sources = [
        {"source": doc.metadata.get("source", "unknown"), "title": doc.metadata.get("title", "")}
        for doc in docs
    ]
    return {"answer": answer, "sources": sources}


async def stream_qa(chain: Any, retriever: Any, question: str) -> AsyncIterator[str]:
    """异步流式生成器"""
    docs = retriever.invoke(question)
    
    if not docs:
        yield "这个问题我暂时没有找到相关资料，建议直接联系教务处或相关部门咨询。"
        return
    
    async for chunk in chain.astream(question):
        yield chunk

    sources = [
        {"source": doc.metadata.get("source", "unknown"), "title": doc.metadata.get("title", "")}
        for doc in docs
    ]
    yield "\n\n__SOURCES__:" + json.dumps(sources, ensure_ascii=False)
