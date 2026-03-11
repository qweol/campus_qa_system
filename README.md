# 基于 LangChain 的校园智能问答系统（最小可用版）

这是一个可直接运行的 RAG 问答骨架，包含：
- 文档入库脚本（Markdown -> 切分 -> 向量化 -> FAISS）
- FastAPI 问答接口
- Streamlit 简单前端

## 1. 安装依赖

```bash
pip install -r requirements.txt
```

## 2. 配置环境变量

```bash
copy .env.example .env
```

编辑 `.env`：
- `OPENAI_API_KEY`：你的模型平台 Key
- `OPENAI_BASE_URL`：兼容 OpenAI API 的地址
- `LLM_MODEL`：聊天模型名
- `EMBEDDING_MODEL`：向量模型名

## 3. 准备知识库并构建索引

把校园文档放入 `data/` 目录（当前已有示例 `data/campus_qa.md`），然后执行：

```bash
python scripts/build_index.py
```

## 4. 启动后端

```bash
uvicorn app.main:app --reload
```

默认地址：`http://127.0.0.1:8000`  
接口文档：`http://127.0.0.1:8000/docs`

## 5. 启动前端

新开终端执行：

```bash
streamlit run frontend/streamlit_app.py
```

## 6. 后续建议优化

- 增加 `pdf/docx` 加载器
- 增加 reranker（如 bge-reranker）
- 增加问题改写、意图识别和多轮上下文
- 增加评测集和离线指标统计（命中率、正确率、幻觉率）
