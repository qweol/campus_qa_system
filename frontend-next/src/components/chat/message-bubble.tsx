'use client'

import { BookOpenIcon } from 'lucide-react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'
import type { Message } from '@/hooks/use-chat'

type Props = {
  message: Message
}

const MessageBubble = ({ message }: Props) => {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        {isUser ? '你' : '🤖'}
      </div>

      {/* Bubble */}
      <div className={cn('flex max-w-[80%] flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm'
          )}
        >
          {message.content}
          {message.isStreaming && (
            <span className='ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current' />
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && !message.isStreaming && (
          <details className='group w-full'>
            <summary className='text-muted-foreground hover:text-foreground flex cursor-pointer list-none items-center gap-1 text-xs transition-colors'>
              <BookOpenIcon className='size-3' />
              参考来源 ({message.sources.length})
              <span className='transition-transform group-open:rotate-90'>›</span>
            </summary>
            <div className='bg-muted/50 mt-2 space-y-1 rounded-lg p-3'>
              {message.sources.map((src, i) => (
                <div key={i} className='text-muted-foreground flex items-center gap-2 text-xs'>
                  <span className='bg-muted rounded px-1.5 py-0.5 font-mono'>{src.source}</span>
                  {src.title && <span>{src.title}</span>}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </motion.div>
  )
}

export default MessageBubble
