import Link from 'next/link'

import { Separator } from '@/components/ui/separator'
import { PrimaryOrionButton } from '@/components/ui/orion-button'

import Logo from '@/components/logo'
import { footerData } from '@/assets/data/footer'

const Footer = ({ newsletter = true }: { newsletter?: boolean }) => {
  return (
    <>
      <Separator />

      <footer className='px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl space-y-8 border-x px-4 py-8 sm:px-6 sm:py-16 md:py-24 lg:px-8'>
          {newsletter && (
            <div className='grid grid-cols-1 items-center gap-4 lg:grid-cols-5 xl:gap-24'>
              <div className='col-span-1 space-y-2 lg:col-span-3'>
                <h6 className='text-2xl font-semibold'>立即体验校园智能问答</h6>
                <p className='text-muted-foreground'>
                  基于 LangChain + RAG 技术，为在校师生提供教务政策、课程安排、图书馆服务等问题的智能解答。
                </p>
              </div>
              <div className='col-span-1 lg:col-span-2'>
                <div className='flex justify-start gap-3 lg:justify-end'>
                  <PrimaryOrionButton size='lg' className='rounded-lg' asChild>
                    <Link href='/chat'>开始提问 →</Link>
                  </PrimaryOrionButton>
                </div>
              </div>
            </div>
          )}

          <div className='grid grid-flow-row grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5'>
            {footerData.map((section, index) => (
              <div key={index} className='flex flex-col gap-5'>
                <div className='text-lg font-medium'>{section.title}</div>
                <ul className='text-muted-foreground space-y-3'>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className='text-muted-foreground hover:text-foreground transition-colors duration-300'
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='mx-auto max-w-7xl border-x'>
          <Separator />
          <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 p-4 sm:px-6 lg:px-8'>
            <Link href='/#home'>
              <Logo />
            </Link>
            <p className='text-muted-foreground font-light'>
              {`©${new Date().getFullYear()}`}{' '}
              <Link href='/#home' className='link-animated'>
                校园智能问答系统
              </Link>
              · 基于 LangChain + RAG 构建
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
