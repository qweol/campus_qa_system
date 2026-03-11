'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpIcon, Loader2Icon, PaperclipIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/layout/mode-toggle'
import Logo from '@/components/logo'

import MessageBubble from '@/components/chat/message-bubble'
import { useChat } from '@/hooks/use-chat'

import Link from 'next/link'

const ChatInterface = () => {
  const { messages, isLoading, serviceStatus, sendMessage, uploadFile, clearMessages, checkHealth } = useChat()
  const [input, setInput] = useState('')
  const [uploadMsg, setUploadMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkHealth()
    const timer = setInterval(checkHealth, 15000)
    return () => clearInterval(timer)
  }, [checkHealth])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const q = input
    setInput('')
    await sendMessage(q)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadMsg('正在上传…')
    const result = await uploadFile(file)
    setUploadMsg(result)
    e.target.value = ''
    setTimeout(() => setUploadMsg(''), 5000)
    // 重新检查服务状态
    checkHealth()
  }

  return (
    <div className='flex h-screen w-full overflow-hidden'>
      {/* ── Sidebar ── */}
      <aside className='bg-card flex w-72 shrink-0 flex-col border-r max-lg:hidden'>
        {/* Logo */}
        <div className='flex items-center justify-between border-b px-5 py-4'>
          <Link href='/'>
            <Logo />
          </Link>
          <ModeToggle />
        </div>

        {/* Service Status */}
        <div className='px-5 py-4'>
          <p className='text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider'>服务状态</p>
          <div className='flex items-center gap-2'>
            <span
              className={`size-2 rounded-full ${
                serviceStatus.status === 'offline'
                  ? 'bg-red-500'
                  : serviceStatus.qaReady
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
              }`}
            />
            <span className='text-sm'>
              {serviceStatus.status === 'offline'
                ? '后端离线'
                : serviceStatus.qaReady
                  ? '服务就绪'
                  : '后端在线（知识库未加载）'}
            </span>
          </div>
          {!serviceStatus.qaReady && serviceStatus.status === 'online' && (
            <p className='text-muted-foreground mt-2 text-xs'>
              请先配置 .env 并执行 build_index.py，或上传文档。
            </p>
          )}
        </div>

        <Separator />

        {/* File Upload */}
        <div className='px-5 py-4'>
          <p className='text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider'>上传知识库文档</p>
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='bg-muted hover:bg-muted/80 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm transition-colors'
          >
            <PaperclipIcon className='text-muted-foreground size-4 shrink-0' />
            <span className='text-muted-foreground'>点击上传 PDF / MD / TXT</span>
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='.pdf,.md,.txt'
            className='hidden'
            onChange={handleFileChange}
          />
          {uploadMsg && (
            <p className={`mt-2 text-xs ${uploadMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
              {uploadMsg}
            </p>
          )}
        </div>

        <Separator />

        {/* Clear History */}
        <div className='px-5 py-4'>
          <Button
            variant='outline'
            size='sm'
            className='w-full gap-2'
            onClick={clearMessages}
            disabled={messages.length === 0}
          >
            <Trash2Icon className='size-4' />
            清空对话
          </Button>
        </div>

        <Separator />

        {/* Tips */}
        <div className='px-5 py-4'>
          <p className='text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider'>使用说明</p>
          <ol className='text-muted-foreground space-y-1.5 text-xs'>
            <li>1. 配置 .env 填写 API Key</li>
            <li>2. 执行 build_index.py 构建索引</li>
            <li>3. 或在此上传文档即时入库</li>
            <li>4. 在下方输入框提问</li>
            <li className='text-xs opacity-70'>Enter 发送 · Shift+Enter 换行</li>
          </ol>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Chat header (mobile) */}
        <div className='bg-card flex items-center justify-between border-b px-4 py-3 lg:hidden'>
          <Link href='/'>
            <Logo />
          </Link>
          <div className='flex items-center gap-2'>
            <span
              className={`size-2 rounded-full ${
                serviceStatus.status === 'offline'
                  ? 'bg-red-500'
                  : serviceStatus.qaReady
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
              }`}
            />
            <ModeToggle />
          </div>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto px-4 py-6 sm:px-6'>
          <div className='mx-auto max-w-3xl space-y-6'>
            {messages.length === 0 && (
              <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
                <span className='text-6xl'>🎓</span>
                <h2 className='text-2xl font-semibold'>你好！我是校园智能助手</h2>
                <p className='text-muted-foreground max-w-md'>
                  你可以问我关于教务政策、图书馆服务、课程安排、校园设施等问题。我会基于知识库给出准确的回答并附上来源。
                </p>
                <div className='mt-2 flex flex-wrap justify-center gap-2'>
                  {['图书馆几点开门？', '补考需要申请吗？', '教务处联系方式？'].map(q => (
                    <Badge
                      key={q}
                      variant='secondary'
                      className='cursor-pointer rounded-full px-4 py-1.5 text-sm hover:bg-secondary/80'
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area */}
        <div className='border-t px-4 py-4 sm:px-6'>
          <div className='mx-auto max-w-3xl'>
            <div className='bg-card relative flex items-end gap-3 rounded-2xl border p-3 shadow-sm focus-within:ring-2 focus-within:ring-ring'>
              {/* Attach */}
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='text-muted-foreground hover:text-foreground mb-1 shrink-0 transition-colors lg:hidden'
              >
                <PaperclipIcon className='size-5' />
              </button>

              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='请输入你的问题… (Enter 发送，Shift+Enter 换行)'
                className='field-sizing-content max-h-40 min-h-10 flex-1 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0'
                disabled={isLoading}
              />

              <Button
                size='icon'
                className='mb-0.5 size-8 shrink-0 rounded-lg'
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2Icon className='size-4 animate-spin' />
                ) : (
                  <ArrowUpIcon className='size-4' />
                )}
              </Button>
            </div>
            <p className='text-muted-foreground mt-2 text-center text-xs'>
              回答基于知识库内容生成 · 附带来源引用
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
