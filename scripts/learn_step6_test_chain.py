"""
学习实验6：测试完整的 RAG 链
目标：实际运行链，观察每一步的输出
"""

import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

load_dotenv()

print("=" * 60)
print("实验6：测试完整的 RAG 链")
print("=" * 60)

# 1. 加载向量库
print("\n【步骤1】加载向量库...")
embeddings = OpenAIEmbeddings(
    model=os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)
vectorstore = FAISS.load_local(
    "storage/faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
print("✅ 向量库加载成功")

# 2. 创建 Prompt 模板
print("\n【步骤2】创建 Prompt 模板...")
prompt_template = """你是一位友善的校园智能问答助手。

检索到的上下文：
{context}

用户问题：
{question}

回答："""

prompt = PromptTemplate.from_template(prompt_template)
print("✅ Prompt 模板创建成功")

# 3. 创建 LLM
print("\n【步骤3】创建 LLM...")
llm = ChatOpenAI(
    model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
    temperature=0.1,
)
print("✅ LLM 创建成功")

# 4. 构建链
print("\n【步骤4】构建 LCEL 链...")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
print("✅ 链构建成功")

# 5. 测试问题
print("\n" + "=" * 60)
print("测试问答")
print("=" * 60)

questions = [
    "图书馆什么时候开门？",
    "补考是什么时候？",
    "你好",
]

for i, question in enumerate(questions, 1):
    print(f"\n【问题 {i}】{question}")
    print("-" * 40)

    # 调用链
    answer = chain.invoke(question)

    print(f"回答：{answer}")
    print()

print("=" * 60)
print("实验完成！")
print("=" * 60)
print("\n关键观察：")
print("1. 链的调用非常简单：chain.invoke(question)")
print("2. 所有步骤自动执行（检索→填充→AI→解析）")
print("3. 不同类型的问题（校园问题 vs 闲聊）得到不同处理")
