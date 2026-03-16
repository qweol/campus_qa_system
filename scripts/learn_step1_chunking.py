"""
学习实验1：理解文档切分（Chunking）
目标：看看 RecursiveCharacterTextSplitter 如何切分文档
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter

# 读取你的知识库文档
with open("data/campus_qa.md", "r", encoding="utf-8") as f:
    text = f.read()

print("=" * 60)
print("原始文档内容：")
print("=" * 60)
print(text)
print(f"\n原始文档长度：{len(text)} 个字符\n")

# 创建切分器（和 build_index.py 中一样的配置）
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=80,
    separators=["\n\n", "\n", "。", "，", " ", ""],
)

# 切分文档
chunks = splitter.split_text(text)

print("=" * 60)
print(f"切分结果：共 {len(chunks)} 个块")
print("=" * 60)

for i, chunk in enumerate(chunks, 1):
    print(f"\n【块 {i}】（{len(chunk)} 个字符）")
    print("-" * 40)
    print(chunk)
    print("-" * 40)

print("\n" + "=" * 60)
print("观察要点：")
print("=" * 60)
print("1. 每个块的大小是否接近 500 字符？")
print("2. 块与块之间是否有重叠内容？（overlap=80）")
print("3. 切分位置是否在合理的地方（段落、句子）？")
