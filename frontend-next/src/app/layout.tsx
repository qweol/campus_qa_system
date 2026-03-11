import type { ReactNode } from 'react'

import { Fira_Code, Lora, Nunito } from 'next/font/google'
import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'

import './globals.css'

const NunitoSans = Nunito({
  variable: '--font-nunito-sans',
  subsets: ['latin']
})

const FiraCodeMono = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin']
})

const LoraSerif = Lora({
  variable: '--font-lora',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    template: '%s - 校园智能问答',
    default: '校园智能问答系统 - 基于 LangChain RAG'
  },
  description: '基于 LangChain 与 RAG 技术的校园智能问答助手，支持教务政策、图书馆、课程安排等多类校园问题的智能解答。',
  robots: 'index,follow',
  keywords: [
    '校园问答',
    '智能问答',
    'LangChain',
    'RAG',
    '教务系统',
    '大学生助手',
    'AI助手',
    '知识库问答'
  ],
  icons: {
    icon: [
      {
        url: '/favicon/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        url: '/favicon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        url: '/favicon/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        url: '/favicon/android-chrome-192x192.png',
        rel: 'icon',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        url: '/favicon/android-chrome-512x512.png',
        rel: 'icon',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}`)
}

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html
      lang='en'
      className={cn(
        `${NunitoSans.variable} ${FiraCodeMono.variable} ${LoraSerif.variable}`,
        'flex min-h-full w-full scroll-smooth'
      )}
      suppressHydrationWarning
    >
      <body className='flex min-h-full w-full flex-auto flex-col'>
        <ThemeProvider attribute='class' enableSystem={false} disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
