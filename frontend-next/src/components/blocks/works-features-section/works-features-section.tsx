'use client'

// React Imports
import { useState } from 'react'
import type { ReactNode } from 'react'

import SectionHeader from '@/components/blocks/section-header'

import Workflow from '@/components/blocks/works-features-section/workflow'
import DottedSheet from '@/components/blocks/works-features-section/dotted-sheet'

// Util Imports
import { cn } from '@/lib/utils'

type DataType = {
  id: string
  icon: ReactNode
  title: string
  description: string
}

const Features = ({ data }: { data: DataType[] }) => {
  const [activeTab, setActiveTab] = useState<string>(data[0].id)
  const [workflowProgress, setWorkflowProgress] = useState<number>(0)

  return (
    <section id='works-features'>
      <SectionHeader title='How it works' description='Here’s a quick look at how the AI agent effectively operates.' />
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl border-x'>
          <div className='grid max-lg:divide-y max-lg:divide-y-reverse lg:grid-cols-2 lg:divide-x'>
            <div className='grid h-full grid-rows-3 divide-y max-lg:order-2'>
              {data.map(tab => {
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-5 px-4 py-9 text-left transition-colors duration-300 outline-none focus-visible:z-1 focus-visible:ring-3 sm:px-6 lg:px-8'
                    )}
                  >
                    <div className='flex items-center gap-5'>
                      <span className={cn('text-muted-foreground [&>svg]:size-4.5', { 'text-foreground': isActive })}>
                        {tab.icon}
                      </span>
                      <h3 className={cn('text-muted-foreground text-xl font-medium', { 'text-foreground': isActive })}>
                        {tab.title}
                      </h3>
                    </div>
                    <p className='text-muted-foreground'>{tab.description}</p>
                    {isActive && (
                      <div
                        data-state='workflow-progress'
                        className='bg-primary absolute inset-x-0 bottom-0 left-0 h-0.5 transition-none'
                        style={{ width: `${workflowProgress}%` }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <div className='relative flex items-center justify-center overflow-hidden px-4 max-lg:h-100'>
              <DottedSheet className='absolute inset-0 h-full w-full' />
              <div className='absolute inset-0 bg-[radial-gradient(circle,transparent_0%,var(--background)_80%)]' />
              <Workflow
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setWorkflowProgress={setWorkflowProgress}
                initialTabId={data[0].id}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
