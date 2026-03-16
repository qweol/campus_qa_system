"""
学习实验4：理解向量检索
目标：看看如何从向量库中检索相关文档
"""

import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

load_dotenv()

# 加载已构建的向量库
embeddings = OpenAIEmbeddings(
    model=os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

vectorstore = FAISS.load_local(
    "storage/faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)

print("=" * 60)
print("向量库信息")
print("=" * 60)
print(f"向量库中共有 {vectorstore.index.ntotal} 个文档块\n")

# 测试不同的问题
questions = [
    "图书馆什么时候开门？",
    "补考是什么时候？",
    "如何申请休学？",
    "今天天气怎么样？",  # 这个问题知识库中没有
]

for question in questions:
    print("=" * 60)
    print(f"问题: {question}")
    print("=" * 60)

    # 检索最相关的 3 个文档块
    docs = vectorstore.similarity_search(question, k=3)

    print(f"检索到 {len(docs)} 个相关文档块：\n")

    for i, doc in enumerate(docs, 1):
        print(f"【文档块 {i}】")
        print(f"来源: {doc.metadata['source']}")
        print(f"内容: {doc.page_content[:150]}...")
        print()
