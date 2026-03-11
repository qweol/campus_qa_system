"""校园智能问答系统 - Streamlit 聊天前端"""
from __future__ import annotations

import json
import os

import httpx
import streamlit as st

# ── 基础配置 ────────────────────────────────────────────────────────────────
API_BASE = os.getenv("API_BASE_URL", "http://127.0.0.1:8001")

st.set_page_config(
    page_title="校园智能问答",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── 全局样式微调 ─────────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
    /* 让来源引用字体稍小一些 */
    .source-tag { font-size: 0.82rem; color: #888; }
    /* 隐藏底部 Made with Streamlit */
    footer { visibility: hidden; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Session 初始化 ────────────────────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages: list[dict] = []


# ── 工具函数 ──────────────────────────────────────────────────────────────────
def get_health() -> dict:
    try:
        resp = httpx.get(f"{API_BASE}/health", timeout=3)
        return resp.json()
    except Exception:
        return {"status": "offline", "qa_ready": "false"}


def stream_answer(question: str):
    """
    向 /chat/stream 发 SSE 请求，逐段 yield 文字 token；
    最后一段若含 __SOURCES__: 则解析成来源列表并存入 session_state。
    """
    full_text = ""
    sources: list[dict] = []

    with httpx.stream(
        "POST",
        f"{API_BASE}/chat/stream",
        json={"question": question},
        timeout=120,
    ) as resp:
        if resp.status_code != 200:
            yield f"[请求失败 {resp.status_code}]"
            return

        for line in resp.iter_lines():
            if not line.startswith("data: "):
                continue
            payload = line[6:]
            if payload == "[DONE]":
                break
            if payload.startswith("__ERROR__:"):
                yield f"\n\n⚠️ {payload[10:]}"
                break

            # 恢复换行符（发送时被替换为 \\n）
            token = payload.replace("\\n", "\n")

            # 最后一段是来源 JSON，不渲染到正文
            if "__SOURCES__:" in token:
                text_part, json_part = token.split("__SOURCES__:", 1)
                if text_part:
                    full_text += text_part
                    yield text_part
                try:
                    sources = json.loads(json_part)
                except Exception:
                    sources = []
            else:
                full_text += token
                yield token

    # 把完整回答 + 来源存回 session_state（替换占位条目）
    st.session_state.messages[-1]["content"] = full_text
    st.session_state.messages[-1]["sources"] = sources


def upload_file(uploaded) -> str:
    """上传文件到 /upload 端点，返回提示文字。"""
    try:
        resp = httpx.post(
            f"{API_BASE}/upload",
            files={"file": (uploaded.name, uploaded.getvalue(), uploaded.type)},
            timeout=120,
        )
        if resp.status_code == 200:
            data = resp.json()
            return f"✅ 上传成功：{data['filename']}（{data['chunks']} 个切片已入库）"
        return f"❌ 上传失败：{resp.text}"
    except Exception as exc:
        return f"❌ 网络错误：{exc}"


# ── 侧边栏 ────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.title("🎓 校园智能问答")
    st.caption("基于 LangChain · RAG · FAISS")
    st.divider()

    # 服务状态
    health = get_health()
    if health["status"] == "offline":
        st.error("后端离线", icon="🔴")
    elif health.get("qa_ready") == "true":
        st.success("服务就绪", icon="🟢")
    else:
        st.warning("后端在线，知识库未加载", icon="🟡")
        st.caption("请先配置 .env 并执行 build_index.py")

    st.divider()

    # 文件上传
    st.subheader("📂 上传知识库文档")
    uploaded = st.file_uploader(
        "支持 PDF / MD / TXT",
        type=["pdf", "md", "txt"],
        label_visibility="collapsed",
    )
    if uploaded:
        with st.spinner("正在上传并入库…"):
            msg = upload_file(uploaded)
        st.info(msg)

    st.divider()

    # 清空对话
    if st.button("🗑️ 清空对话", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

    st.divider()
    st.caption(
        "**使用说明**\n"
        "1. 在 `.env` 填写 API Key\n"
        "2. 运行 `build_index.py` 构建索引\n"
        "3. 或在此上传文档即时入库\n"
        "4. 在下方输入框提问"
    )


# ── 主聊天区 ──────────────────────────────────────────────────────────────────
st.header("校园智能问答助手", divider="gray")

# 渲染历史消息
for msg in st.session_state.messages:
    role = msg["role"]
    with st.chat_message(role, avatar="🧑‍🎓" if role == "user" else "🤖"):
        st.markdown(msg["content"])

        # AI 回复附带来源
        if role == "assistant" and msg.get("sources"):
            with st.expander("📄 参考来源", expanded=False):
                for item in msg["sources"]:
                    src = item.get("source", "unknown")
                    title = item.get("title", "")
                    label = f"`{src}`" + (f"  {title}" if title else "")
                    st.markdown(label, unsafe_allow_html=True)

# 欢迎语（仅首次）
if not st.session_state.messages:
    st.info(
        "👋 你好！我是校园智能问答助手。\n\n"
        "你可以问我关于 **教务**、**图书馆**、**课程安排**、**校园政策** 等问题。",
        icon="💬",
    )

# 输入框
if prompt := st.chat_input("请输入你的问题…"):
    # 追加用户消息
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user", avatar="🧑‍🎓"):
        st.markdown(prompt)

    # 追加 AI 占位消息（内容由 stream_answer 填充）
    st.session_state.messages.append({"role": "assistant", "content": "", "sources": []})

    with st.chat_message("assistant", avatar="🤖"):
        if health["status"] == "offline":
            st.error("后端服务未启动，请先运行 `uvicorn app.main:app --reload`")
            st.session_state.messages[-1]["content"] = "（后端离线）"
        elif health.get("qa_ready") != "true":
            warn = "知识库尚未加载，请先构建索引或上传文档。"
            st.warning(warn)
            st.session_state.messages[-1]["content"] = warn
        else:
            answer = st.write_stream(stream_answer(prompt))

            sources = st.session_state.messages[-1].get("sources", [])
            if sources:
                with st.expander("📄 参考来源", expanded=False):
                    for item in sources:
                        src = item.get("source", "unknown")
                        title = item.get("title", "")
                        label = f"`{src}`" + (f"  {title}" if title else "")
                        st.markdown(label, unsafe_allow_html=True)
