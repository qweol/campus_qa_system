from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader #文档加载器（读取文件夹中的文件）和 文本加载器（读取单个文本文件）
from langchain_community.vectorstores import FAISS #向量数据库（Facebook 开源的向量检索库）
from langchain_openai import OpenAIEmbeddings #向量化工具，使用 OpenAI 的嵌入模型（将文本转换为向量）
from langchain_text_splitters import RecursiveCharacterTextSplitter #文本分割器（将文本分割为多个小块）

from app.config import settings

#加载文档
def main() -> None:
    load_dotenv()
    data_path = Path("data")
    if not data_path.exists():
        raise FileNotFoundError("data 目录不存在，请先创建并放入知识库文档。")

    loader = DirectoryLoader(
        str(data_path),
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
        show_progress=True,
    )
    docs = loader.load()
    if not docs:
        raise ValueError("未读取到文档，请检查 data/*.md 文件。")

#文本分割
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,  # 每块最多 500 个字符
        chunk_overlap=80,  # 每块重叠 80 个字符
        separators=["\n\n", "\n", "。", "，", " ", ""], # 优先在这些位置切分
    )
    chunks = splitter.split_documents(docs)

#向量化
    embeddings = OpenAIEmbeddings(
        model=settings.embedding_model,
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
    )
    vectorstore = FAISS.from_documents(chunks, embeddings) #调用OpenAI的嵌入模型将文本分割后的块转换为向量，并存储到向量数据库中
    output_path = Path(settings.vector_db_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(output_path))
    print(f"索引构建完成，共 {len(chunks)} 个切片，保存到: {output_path}")


if __name__ == "__main__":
    main()
