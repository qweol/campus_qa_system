from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings


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

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=80,
        separators=["\n\n", "\n", "。", "，", " ", ""],
    )
    chunks = splitter.split_documents(docs)

    embeddings = OpenAIEmbeddings(
        model=settings.embedding_model,
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
    )
    vectorstore = FAISS.from_documents(chunks, embeddings)
    output_path = Path(settings.vector_db_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(output_path))
    print(f"索引构建完成，共 {len(chunks)} 个切片，保存到: {output_path}")


if __name__ == "__main__":
    main()
