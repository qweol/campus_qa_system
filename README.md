# 基于 LangChain 的校园智能问答系统

基于 RAG（检索增强生成）技术构建的校园问答助手，支持教务政策、图书馆服务、课程安排等多类校园问题的智能解答。

## 技术栈

| 层次 | 技术 |
|------|------|
| 前端 | Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui |
| 后端 | Python + FastAPI + LangChain |
| 向量库 | FAISS（Facebook AI Similarity Search） |
| 大模型 | OpenAI 兼容接口（GPT-4o-mini 等） |

## 项目结构

```
毕业设计/
├── app/                    # FastAPI 后端
│   ├── main.py             # API 路由（/health /chat /chat/stream /upload）
│   ├── rag.py              # LCEL RAG 链，支持流式输出
│   └── config.py           # 环境变量配置
├── scripts/
│   └── build_index.py      # 文档入库脚本
├── data/                   # 知识库文档（.md 格式）
├── storage/                # FAISS 索引持久化目录
├── frontend-next/          # Next.js 前端
│   └── src/
│       ├── app/
│       │   ├── (pages)/page.tsx      # 落地页
│       │   └── (chat)/chat/page.tsx  # 聊天页
│       ├── components/
│       │   ├── chat/                 # 聊天组件
│       │   └── blocks/               # 页面区块
│       └── hooks/use-chat.ts         # 流式问答 Hook
├── .env                    # 环境变量（不提交）
└── requirements.txt        # Python 依赖
```

## 快速启动

### 1. 安装 Python 依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

编辑 `.env`：

```env
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
VECTOR_DB_PATH=./storage/faiss_index
```

### 3. 构建知识库索引

将文档放入 `data/` 目录后执行：

```powershell
$env:PYTHONPATH = (Get-Location).Path
python scripts/build_index.py
```

### 4. 启动后端

```powershell
$env:PYTHONPATH = (Get-Location).Path
uvicorn app.main:app --host 127.0.0.1 --port 8001
```

后端地址：`http://127.0.0.1:8001`  
接口文档：`http://127.0.0.1:8001/docs`

### 5. 启动前端

```powershell
cd frontend-next
npm install   # 首次运行
npm run dev
```

前端地址：`http://localhost:3000`

---

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 服务状态检查 |
| POST | `/chat` | 同步问答 |
| POST | `/chat/stream` | **流式问答（SSE）** |
| POST | `/upload` | 上传文档并增量入库 |

## 后续优化方向

- 增加多轮对话记忆（`ConversationBufferMemory`）
- 增加混合检索（FAISS + BM25 关键词）
- 增加问题改写与意图识别
- 增加评测集（命中率、正确率统计）
- 支持更多文档格式（PDF、Word、Excel）
