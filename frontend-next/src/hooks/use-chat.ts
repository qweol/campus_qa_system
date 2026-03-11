'use client'

import { useState, useCallback } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8001'

export type Source = {
  source: string
  title: string
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  isStreaming?: boolean
}

export type ServiceStatus = {
  status: 'online' | 'offline'
  qaReady: boolean
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({ status: 'offline', qaReady: false })

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' })
      const data = await res.json()
      setServiceStatus({ status: 'online', qaReady: data.qa_ready === 'true' })
    } catch {
      setServiceStatus({ status: 'offline', qaReady: false })
    }
  }, [])

  const sendMessage = useCallback(async (question: string) => {
    if (isLoading || !question.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question.trim()
    }

    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      sources: [],
      isStreaming: true
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let sources: Source[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') break

          // 恢复换行符
          const token = payload.replace(/\\n/g, '\n')

          if (token.includes('__SOURCES__:')) {
            const [textPart, jsonPart] = token.split('__SOURCES__:')
            if (textPart) fullText += textPart
            try {
              sources = JSON.parse(jsonPart)
            } catch { /* ignore */ }
          } else if (token.startsWith('__ERROR__:')) {
            fullText += `\n\n⚠️ ${token.slice(10)}`
          } else {
            fullText += token
          }

          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? { ...m, content: fullText, sources, isStreaming: true }
                : m
            )
          )
        }
      }

      // 流结束，去除 isStreaming 标志
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: fullText, sources, isStreaming: false }
            : m
        )
      )
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '请求失败，请检查后端服务是否运行。'
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: `❌ ${errMsg}`, isStreaming: false }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? '上传失败')
      return `✅ 上传成功：${data.filename}（${data.chunks} 个切片已入库）`
    } catch (err) {
      return `❌ ${err instanceof Error ? err.message : '上传失败'}`
    }
  }, [])

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, isLoading, serviceStatus, sendMessage, uploadFile, clearMessages, checkHealth }
}
