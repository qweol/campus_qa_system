export type FAQItem = {
  question: string
  answer: string
}

export const faqData: FAQItem[] = [
  {
    question: '这个系统能回答哪些类型的问题？',
    answer: '系统支持校园相关的各类问题，包括教务政策、选课流程、考试安排、图书馆服务、校园设施等。知识库内容越丰富，回答质量越高。'
  },
  {
    question: '如何添加更多校园知识？',
    answer: '在聊天页面左侧边栏，点击"上传文档"按钮，支持上传 PDF、Markdown、TXT 格式的文档，系统会自动将文档切片并入库，秒级生效。'
  },
  {
    question: '回答准确率有保障吗？',
    answer: '系统基于 RAG（检索增强生成）技术，回答会严格基于知识库内容，并附带来源引用。如果知识库中没有相关内容，系统会明确告知，不会编造信息。'
  },
  {
    question: '支持多轮对话吗？',
    answer: '当前版本为单轮问答模式，每个问题独立处理。多轮上下文记忆功能正在开发中，将在后续版本中支持。'
  },
  {
    question: '流式输出是什么意思？',
    answer: '类似 ChatGPT 的逐字打字效果。回答会实时逐字出现在屏幕上，而不是等待全部生成后才显示，大幅减少等待感。'
  },
  {
    question: '系统使用什么技术构建？',
    answer: '后端使用 Python + FastAPI + LangChain，向量库使用 FAISS，支持 OpenAI 兼容的任意大语言模型。前端使用 Next.js + shadcn/ui + Tailwind CSS。'
  }
]
