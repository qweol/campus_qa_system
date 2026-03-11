import type { ReactNode } from 'react'

import Header from '@/components/layout/header'
import { navigationData } from '@/assets/data/header'

const PagesLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <>
      <div className='flex flex-col'>
        <Header navigationData={navigationData} />
        <main className='flex flex-col *:scroll-mt-16'>{children}</main>
      </div>
    </>
  )
}

export default PagesLayout
