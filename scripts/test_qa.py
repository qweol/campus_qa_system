"""临时测试脚本：验证新 Prompt 效果"""
import sys
sys.path.insert(0, ".")

from app.rag import build_rag_chain, ask_question

chain, retriever = build_rag_chain()

tests = [
    "你好",
    "谢谢你",
    "图书馆几点关门？",
    "今天天气怎么样",
    "补考需要提前申请吗？",
]

for q in tests:
    r = ask_question(chain, retriever, q)
    print(f"问：{q}")
    print(f"答：{r['answer']}")
    print("-" * 40)
