import os
from pathlib import Path

class Settings:
    # OpenAI配置
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_base_url: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    
    # 模型配置
    llm_model: str = "gpt-3.5-turbo"
    embedding_model: str = "text-embedding-ada-002"
    
    # 路径配置
    base_dir: Path = Path(__file__).parent.parent
    docs_path: str = str(base_dir / "data" / "docs")
    vector_db_path: str = str(base_dir / "data" / "vectorstore")
    
    # 检索配置
    retrieval_k: int = 4

settings = Settings()
