"""
V3.0: 混合检索 + Rerank重排序
升级说明：在V2.0基础上加入BGE Reranker精排，进一步提升检索准确率
解决问题：混合检索虽然召回率高，但Top结果中仍有不够相关的文档
"""

from __future__ import annotations

import hashlib
import logging
import time
from pathlib import Path
from typing import Iterator

from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_core.language_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from sentence_transformers import CrossEncoder

from app.config import settings

logger = logging.getLogger(__name__)

# 全局缓存
_bm25_retriever = None
_reranker_model = None


def _get_bm25_retriever() -> BM25Retriever:
    """获取缓存的BM25检索器"""
    global _bm25_retriever
    if _bm25_retriever is None:
        logger.info("首次加载BM25检索器...")
        docs = _load_documents_for_bm25()
        _bm25_retriever = BM25Retriever.from_documents(docs)
        _bm25_retriever.k = 10  # 粗筛Top 10
        logger.info(f"BM25检索器加载完成，文档数：{len(docs)}")
    return _bm25_retriever


def _get_reranker() -> CrossEncoder:
    """获取缓存的Rerank模型"""
    global _reranker_model
    if _reranker_model is None:
        logger.info("加载BGE Reranker模型...")
        _reranker_model = CrossEncoder('BAAI/bge-reranker-base', max_length=512)
        logger.info("Reranker模型加载完成")
    return _reranker_model


def _normalize_scores(scores: list[float]) -> list[float]:
    """归一化分数到0-1区间"""
    if not scores or max(scores) == min(scores):
        return [1.0] * len(scores)
    min_score = min(scores)
    max_score = max(scores)
    return [(s - min_score) / (max_score - min_score) for s in scores]


class HybridRetrieverWithRerank:
    """混合检索器 + Rerank重排序"""
    
    def __init__(
        self,
        vector_retriever,
        bm25_retriever,
        reranker: CrossEncoder,
        weights=(0.7, 0.3),
        similarity_threshold=0.5,
        rerank_top_k=3
    ):
        self.vector_retriever = vector_retriever
        self.bm25_retriever = bm25_retriever
        self.reranker = reranker
        self.weights = weights
        self.similarity_threshold = similarity_threshold
        self.rerank_top_k = rerank_top_k
    
    def invoke(self, query: str) -> list[Document]:
        """执行混合检索 + Rerank"""
        start_time = time.time()
        
        # 第1步：向量检索（粗筛）
        vector_start = time.time()
        vector_results = self.vector_retriever.similarity_search_with_score(query, k=10)
        vector_time = time.time() - vector_start
        
        # 相似度阈值过滤
        filtered_vector = [(doc, score) for doc, score in vector_results if score < self.similarity_threshold]
        
        if not filtered_vector:
            logger.warning(f"向量检索未找到相关文档（阈值={self.similarity_threshold}）")
            return []
        
        # 第2步：BM25检索（粗筛）
        bm25_start = time.time()
        bm25_docs = self.bm25_retriever.invoke(query)
        bm25_time = time.time() - bm25_start
        
        # 第3步：加权融合（粗筛Top 10）
        merge_start = time.time()
        merged_docs = self._merge_with_weights(query, filtered_vector, bm25_docs)
        merge_time = time.time() - merge_start
        
        if not merged_docs:
            return []
        
        # 第4步：Rerank精排（Top 10 → Top 3）
        rerank_start = time.time()
        final_docs = self._rerank(query, merged_docs[:10])  # 只对Top 10做Rerank
        rerank_time = time.time() - rerank_start
        
        total_time = time.time() - start_time
        
        logger.info(
            f"检索完成 | 总耗时:{total_time:.3f}s | "
            f"向量:{vector_time:.3f}s({len(filtered_vector)}条) | "
            f"BM25:{bm25_time:.3f}s({len(bm25_docs)}条) | "
            f"融合:{merge_time:.3f}s({len(merged_docs)}条) | "
            f"Rerank:{rerank_time:.3f}s({len(final_docs)}条)"
        )
        
        return final_docs
    
    def _merge_with_weights(
        self,
        query: str,
        vector_results: list[tuple[Document, float]],
        bm25_docs: list[Document]
    ) -> list[Document]:
        """加权融合向量检索和BM25结果"""
        final_scores = {}
        
        # 向量检索分数（距离越小越好，需要转换）
        vector_scores = [1 / (1 + score) for _, score in vector_results]
        vector_scores_norm = _normalize_scores(vector_scores)
        
        for (doc, _), norm_score in zip(vector_results, vector_scores_norm):
            doc_key = hashlib.md5(doc.page_content.encode()).hexdigest()
            final_scores[doc_key] = {"doc": doc, "score": self.weights[0] * norm_score}
        
        # BM25分数
        bm25_scores = self.bm25_retriever.get_scores(query)
        bm25_scores_norm = _normalize_scores(bm25_scores)
        
        for doc, norm_score in zip(bm25_docs, bm25_scores_norm):
            doc_key = hashlib.md5(doc.page_content.encode()).hexdigest()
            if doc_key in final_scores:
                final_scores[doc_key]["score"] += self.weights[1] * norm_score
            else:
                final_scores[doc_key] = {"doc": doc, "score": self.weights[1] * norm_score}
        
        # 按分数排序
        sorted_results = sorted(final_scores.values(), key=lambda x: x["score"], reverse=True)
        return [item["doc"] for item in sorted_results]
    
    def _rerank(self, query: str, docs: list[Document]) -> list[Document]:
        """使用Rerank模型精排"""
        if not docs:
            return []
        
        # 构造query-doc对
        pairs = [[query, doc.page_content] for doc in docs]
        
        # Rerank打分
        scores = self.reranker.predict(pairs)
        
        # 按分数排序，取Top K
        ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
        top_docs = [doc for doc, score in ranked[:self.rerank_top_k]]
        
        # 记录Rerank分数（用于调试）
        for doc, score in ranked[:self.rerank_top_k]:
            logger.debug(f"Rerank分数: {score:.4f} | 内容: {doc.page_content[:50]}...")
        
        return top_docs


def _load_documents_for_bm25() -> list[Document]:
    """加载文档用于BM25检索"""
    docs_path = Path(settings.DOCUMENTS_PATH)
    if not docs_path.exists():
        logger.warning(f"文档目录不存在: {docs_path}")
        return []
    
    from langchain_community.document_loaders import DirectoryLoader, TextLoader
    
    loader = DirectoryLoader(
        str(docs_path),
        glob="**/*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"}
    )
    return loader.load()


def _load_vectorstore() -> FAISS:
    """加载向量数据库"""
    embeddings = OpenAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        openai_api_key=settings.OPENAI_API_KEY,
        openai_api_base=settings.OPENAI_API_BASE
    )
    
    vectorstore_path = Path(settings.VECTORSTORE_PATH)
    if not vectorstore_path.exists():
        raise FileNotFoundError(f"向量数据库不存在: {vectorstore_path}")
    
    return FAISS.load_local(
        str(vectorstore_path),
        embeddings,
        allow_dangerous_deserialization=True
    )


def _make_llm() -> BaseChatModel:
    """创建LLM"""
    return ChatOpenAI(
        model=settings.LLM_MODEL,
        temperature=0.7,
        openai_api_key=settings.OPENAI_API_KEY,
        openai_api_base=settings.OPENAI_API_BASE,
        streaming=True
    )


def build_rerank_rag_chain():
    """构建V3.0 RAG链（混合检索 + Rerank）"""
    vectorstore = _load_vectorstore()
    vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})
    
    bm25_retriever = _get_bm25_retriever()
    reranker = _get_reranker()
    
    hybrid_retriever = HybridRetrieverWithRerank(
        vector_retriever=vector_retriever,
        bm25_retriever=bm25_retriever,
        reranker=reranker,
        weights=(0.7, 0.3),
        similarity_threshold=0.5,
        rerank_top_k=3  # 最终返回Top 3
    )
    
    llm = _make_llm()
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """你是一个专业的校园问答助手。

请根据以下参考资料回答用户的问题：

{context}

回答要求：
1. 如果参考资料中有明确答案，直接基于资料回答
2. 如果参考资料不足以回答问题，明确告知用户"根据现有资料无法回答，建议联系教务处咨询"
3. 不要编造信息
4. 回答要简洁、准确、友好"""),
        ("human", "{question}")
    ])
    
    def rag_chain(question: str) -> Iterator[str]:
        """RAG问答链"""
        docs = hybrid_retriever.invoke(question)
        
        if not docs:
            yield "抱歉，我没有找到相关信息。建议您直接联系教务处咨询。"
            return
        
        context = "\n\n".join([f"资料{i+1}:\n{doc.page_content}" for i, doc in enumerate(docs)])
        
        messages = prompt.format_messages(context=context, question=question)
        
        for chunk in llm.stream(messages):
            if chunk.content:
                yield chunk.content
    
    return rag_chain
