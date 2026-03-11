import Link from 'next/link'
import { SecondaryOrionButton } from '@/components/ui/orion-button'

const NotFound = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-8 text-center'>
      <div className='text-8xl font-bold opacity-20'>404</div>
      <div className='space-y-3'>
        <h1 className='text-3xl font-semibold'>页面不存在</h1>
        <p className='text-muted-foreground'>你访问的页面可能已被删除或从未存在过。</p>
      </div>
      <SecondaryOrionButton size='lg' asChild>
        <Link href='/'>返回首页</Link>
      </SecondaryOrionButton>
    </div>
  )
}

export default NotFound
