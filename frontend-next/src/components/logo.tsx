import { cn } from '@/lib/utils'

const Logo = ({ className, fontSize }: { className?: string; logoSize?: string; fontSize?: string }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className='text-2xl'>🎓</span>
      <span className={cn('text-xl font-semibold', fontSize)}>校园问答</span>
    </div>
  )
}

export default Logo
