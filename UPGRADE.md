# 校园智能问答系统 - 混合检索升级指南

## 升级说明

已完成 V1.0 → V2.0 升级：**基础RAG → 混合检索**

### 升级内容

**新增文件：**
- `app/rag_hybrid.py` - 混合检索实现（向量检索 + BM25关键词检索）

**核心改进：**
1. **向量检索（70%权重）** - 理解语义相似性
2. **BM25关键词检索（30%权重）** - 精确匹配专有名词和时间

### 解决的问题

**问题1：时间敏感查询不准确**
- 之前：用户问"2024年春季选课时间"，可能返回"2023年春季"
- 现在：BM25精确匹配"2024"，不会错配年份

**问题2：专有名词匹配失败**
- 之前：用户问"计算机学院"，可能返回"软件学院"
- 现在：关键词检索确保精确匹配

### 使用方法

```python
from app.rag_hybrid import build_hybrid_rag_chain, ask_question

# 构建混合检索链
chain, retriever = build_hybrid_rag_chain()

# 提问
result = ask_question(chain, retriever, "2024年春季学期选课时间")
print(result["answer"])
```

### 下一步升级计划

- [ ] V3.0: 加入 BGE Rerank 重排序
- [ ] V4.0: 集成 RAGAS 自动化评测
- [ ] V5.0: Prometheus + Grafana 监控系统

### 技术栈

- LangChain - RAG框架
- FAISS - 向量数据库
- BM25 - 关键词检索算法
- OpenAI - Embedding + LLM
