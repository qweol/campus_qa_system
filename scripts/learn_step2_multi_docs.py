"""
学习实验2：理解多文档加载和切分
目标：看看 DirectoryLoader 如何加载多个文档，以及切分效果
"""

from pathlib import Path
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 第1步：加载所有文档
print("=" * 60)
print("第1步：加载文档")
print("=" * 60)

loader = DirectoryLoader(
    "data",
    glob="**/*.md",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8"},
)
docs = loader.load()

print(f"共加载 {len(docs)} 个文档\n")

for i, doc in enumerate(docs, 1):
    print(f"文档 {i}:")
    print(f"  来源: {doc.metadata['source']}")
    print(f"  长度: {len(doc.page_content)} 字符")
    print(f"  前100字符: {doc.page_content[:100]}...")
    print()

# 第2步：切分文档
print("=" * 60)
print("第2步：切分文档")
print("=" * 60)

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=80,
    separators=["\n\n", "\n", "。", "，", " ", ""],
)
chunks = splitter.split_documents(docs)

print(f"切分后共 {len(chunks)} 个块\n")

# 显示每个块的信息
for i, chunk in enumerate(chunks, 1):
    print(f"块 {i}:")
    print(f"  来源: {chunk.metadata['source']}")
    print(f"  长度: {len(chunk.page_content)} 字符")
    print(f"  内容预览: {chunk.page_content[:80].replace(chr(10), ' ')}...")
    print()

print("=" * 60)
print("关键观察：")
print("=" * 60)
print("1. 每个原始文档被切成了几个块？")
print("2. 块的大小是否接近 500 字符？")
print("3. metadata 中的 source 信息是否保留？")
