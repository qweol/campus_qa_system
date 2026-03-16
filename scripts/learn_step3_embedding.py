"""
学习实验3：理解向量化（Embedding）
目标：看看文字如何转换成向量，以及向量的相似度计算

注意：这个脚本会调用 OpenAI API，会产生少量费用（约 $0.001）
"""

import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
import numpy as np

load_dotenv()

# 创建 embedding 对象
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

print("=" * 60)
print("实验：文字 → 向量")
print("=" * 60)

# 测试几个不同的文本
texts = [
    "图书馆周一到周五开放时间是07:30-22:30",
    "图书馆的营业时间是什么",
    "补考安排在每学期开学后第3-5周",
    "今天天气真好",
]

print("\n正在调用 OpenAI API 生成向量...\n")

# 生成向量
vectors = embeddings.embed_documents(texts)

# 显示结果
for i, (text, vector) in enumerate(zip(texts, vectors), 1):
    print(f"文本 {i}: {text}")
    print(f"  向量维度: {len(vector)}")
    print(f"  向量前10个数字: {vector[:10]}")
    print(f"  向量类型: {type(vector[0])}")
    print()

print("=" * 60)
print("实验：计算向量相似度")
print("=" * 60)

# 计算余弦相似度
def cosine_similarity(vec1, vec2):
    """计算两个向量的余弦相似度（值越大越相似，范围0-1）"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

print("\n相似度矩阵（数字越大越相似）：\n")

# 打印表头
print(f"{'':40}", end="")
for i in range(len(texts)):
    print(f"文本{i+1:2}  ", end="")
print()

# 计算并打印相似度
for i, vec1 in enumerate(vectors):
    print(f"文本{i+1}: {texts[i]:30}", end="")
    for j, vec2 in enumerate(vectors):
        similarity = cosine_similarity(vec1, vec2)
        print(f"{similarity:.3f}  ", end="")
    print()

print("\n" + "=" * 60)
print("关键发现：")
print("=" * 60)
print("1. 每个文本被转换成 1536 个数字（向量维度）")
print("2. 文本1和文本2（都是关于图书馆开放时间）相似度最高")
print("3. 文本4（天气）和其他文本相似度很低")
print("4. 这就是 RAG 检索的原理：找到向量最相似的文档！")
