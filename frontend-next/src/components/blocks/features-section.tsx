import { BookOpenIcon, BrainCircuitIcon, FileUpIcon, SearchIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react'
import SectionHeader from '@/components/blocks/section-header'

const features = [
  {
    icon: BrainCircuitIcon,
    title: 'RAG 检索增强生成',
    description: '将用户问题向量化后在知识库中精准检索，结合大模型生成结构清晰的回答，而非凭空生成。'
  },
  {
    icon: SearchIcon,
    title: 'FAISS 向量检索',
    description: '使用 Facebook FAISS 引擎进行毫秒级语义相似度搜索，支持千级文档切片的高效检索。'
  },
  {
    icon: ZapIcon,
    title: '流式实时输出',
    description: '基于 SSE 协议，回答逐字实时推送到前端，打字机效果消除等待感，响应时间感知提升 60%。'
  },
  {
    icon: FileUpIcon,
    title: '文档即时入库',
    description: '支持上传 PDF、Markdown、TXT 文档，自动切片、向量化并增量写入知识库，无需重建索引。'
  },
  {
    icon: BookOpenIcon,
    title: '来源引用溯源',
    description: '每条回答附带参考来源文件名，用户可展开查看引用片段，确保信息可信可追溯。'
  },
  {
    icon: ShieldCheckIcon,
    title: '拒绝编造信息',
    description: '如果知识库中没有相关内容，系统明确说明"未找到依据"，杜绝幻觉式回答，保证信息准确性。'
  }
]

const FeaturesSection = () => {
  return (
    <section id='features'>
      <SectionHeader
        title='核心功能'
        description='基于 LangChain 构建的完整 RAG 问答流程，从文档入库到智能问答一体化。'
      />
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto grid max-w-7xl grid-cols-1 border-x sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className='group flex flex-col gap-5 border-b p-8 last:border-b-0 sm:even:border-l lg:border-b lg:[&:nth-child(3n+2)]:border-x lg:[&:nth-child(n+4)]:border-t'
              >
                <div className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground'>
                  <Icon className='size-6' />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-lg font-semibold'>{feature.title}</h3>
                  <p className='text-muted-foreground text-sm leading-relaxed'>{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
