import type { Metadata } from 'next'
import ChatInterface from '@/components/chat/chat-interface'

export const metadata: Metadata = {
  title: '智能问答'
}

const ChatPage = () => {
  return <ChatInterface />
}

export default ChatPage
