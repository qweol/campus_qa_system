import { ArrowDownIcon } from 'lucide-react'
import SectionHeader from '@/components/blocks/section-header'

const steps = [
  {
    step: '01',
    title: '构建知识库',
    description: '将校园文档（教务规章、选课手册、图书馆公告等）上传至系统，自动完成切片与向量化，存入 FAISS 索引。',
    detail: '支持 PDF / MD / TXT 格式，上传后秒级生效'
  },
  {
    step: '02',
    title: '语义检索',
    description: '用户提问后，系统将问题转为向量，在知识库中进行语义相似度搜索，召回最相关的 4 个文档片段。',
    detail: '使用 OpenAI Embeddings 进行向量化检索'
  },
  {
    step: '03',
    title: 'LLM 生成回答',
    description: '将检索到的上下文与用户问题一起传入大语言模型，基于真实资料生成准确、结构清晰的回答。',
    detail: '支持任意 OpenAI 兼容接口的模型'
  },
  {
    step: '04',
    title: '流式返回展示',
    description: '回答通过 SSE 协议逐字推送到前端，实现打字机效果，并在回答末尾展示引用的来源文件。',
    detail: '来源可溯源，杜绝信息编造'
  }
]

const HowItWorksSection = () => {
  return (
    <section id='how-it-works'>
      <SectionHeader
        title='使用方式'
        description='四步完成从文档入库到智能问答的完整流程。'
      />
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl border-x'>
          <div className='relative px-4 py-12 sm:px-8 sm:py-16'>
            <div className='space-y-0'>
              {steps.map((step, index) => (
                <div key={index} className='relative'>
                  <div className='flex gap-6'>
                    {/* Step number + line */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold'>
                        {step.step}
                      </div>
                      {index < steps.length - 1 && (
                        <div className='bg-border mt-2 w-0.5 flex-1' style={{ minHeight: '2.5rem' }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className='pb-10 pt-1.5'>
                      <h3 className='mb-2 text-lg font-semibold'>{step.title}</h3>
                      <p className='text-muted-foreground mb-2 text-sm leading-relaxed'>{step.description}</p>
                      <span className='text-primary bg-primary/10 rounded-full px-3 py-1 text-xs font-medium'>
                        {step.detail}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
