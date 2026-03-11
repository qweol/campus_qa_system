'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { BookOpenIcon, MessageCircleIcon, SearchIcon, UploadIcon } from 'lucide-react'

import { PrimaryOrionButton, SecondaryOrionButton } from '@/components/ui/orion-button'
import { BorderBeam } from '@/components/ui/border-beam'
import { Badge } from '@/components/ui/badge'

const HeroSection = () => {
  return (
    <section id='home' className='relative overflow-hidden px-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl border-x'>
        <div className='flex flex-col items-center gap-8 px-4 py-16 text-center sm:px-8 md:py-24 lg:py-32'>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant='outline' className='relative gap-2 rounded-full px-4 py-1.5 text-sm font-medium'>
              <span className='bg-primary size-2 rounded-full' />
              基于 LangChain + RAG 技术构建
              <BorderBeam size={80} duration={8} />
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl'
          >
            你的
            <span className='text-primary'> 校园智能助手 </span>
            <br className='hidden sm:block' />
            随时解答一切校园疑问
          </motion.h1>

          {/* Sub heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-muted-foreground max-w-2xl text-lg leading-relaxed sm:text-xl'
          >
            基于检索增强生成（RAG）技术，精准搜索校园知识库，为在校师生提供教务政策、
            图书馆服务、课程安排等问题的智能解答，答案有据可查。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='flex flex-wrap items-center justify-center gap-4'
          >
            <PrimaryOrionButton size='lg' className='rounded-xl px-8' asChild>
              <Link href='/chat'>
                <MessageCircleIcon className='size-5' />
                立即提问
              </Link>
            </PrimaryOrionButton>
            <SecondaryOrionButton size='lg' className='rounded-xl px-8' asChild>
              <Link href='/#features'>了解功能</Link>
            </SecondaryOrionButton>
          </motion.div>

          {/* Demo Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className='relative mt-4 w-full max-w-3xl'
          >
            <div className='bg-card relative overflow-hidden rounded-2xl border shadow-2xl'>
              <BorderBeam size={200} duration={12} />
              {/* Mock Chat UI */}
              <div className='flex items-center justify-between border-b px-5 py-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>🎓</span>
                  <span className='text-sm font-semibold'>校园智能问答</span>
                </div>
                <div className='flex gap-1.5'>
                  <div className='bg-muted size-3 rounded-full' />
                  <div className='bg-muted size-3 rounded-full' />
                  <div className='bg-primary size-3 rounded-full' />
                </div>
              </div>

              <div className='space-y-4 p-6'>
                {/* User message */}
                <div className='flex justify-end'>
                  <div className='bg-primary text-primary-foreground max-w-xs rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm'>
                    图书馆几点关门？周末有开吗？
                  </div>
                </div>
                {/* Assistant message */}
                <div className='flex gap-3'>
                  <div className='bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-sm'>🤖</div>
                  <div className='bg-muted max-w-sm rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed'>
                    图书馆开放时间如下：
                    <br />• 周一至周五：07:30 - 22:30
                    <br />• 周末：08:30 - 21:30
                    <br />• 法定节假日另行通知
                    <div className='text-muted-foreground mt-2 flex items-center gap-1 text-xs'>
                      <BookOpenIcon className='size-3' />
                      来源：campus_qa.md
                    </div>
                  </div>
                </div>
                {/* Input area */}
                <div className='bg-background flex items-center gap-3 rounded-xl border px-4 py-3'>
                  <SearchIcon className='text-muted-foreground size-4' />
                  <span className='text-muted-foreground flex-1 text-sm'>输入你的问题…</span>
                  <UploadIcon className='text-muted-foreground size-4' />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
