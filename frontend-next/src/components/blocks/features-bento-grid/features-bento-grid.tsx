import SectionHeader from '@/components/blocks/section-header'

import SecureTransparent from '@/components/blocks/features-bento-grid/secure-transparent'
import SmartWorkflow from '@/components/blocks/features-bento-grid/smart-workflow'
import CrossPlatform from '@/components/blocks/features-bento-grid/cross-platform'
import MultiAI from '@/components/blocks/features-bento-grid/multi-ai'
import RealTime from '@/components/blocks/features-bento-grid/real-time'

const BentoGrid = () => {
  return (
    <section id='features'>
      <SectionHeader
        title='Features'
        description='Boost your efficiency with an AI agent that eliminates manual work and streamlines your operations.'
      />
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto grid max-w-7xl grid-cols-1 border-x sm:grid-cols-2 lg:grid-cols-3'>
          <div className='flex flex-col gap-8 overflow-hidden py-6 max-sm:border-b'>
            <SecureTransparent />
            <div className='space-y-4 px-4 sm:px-6 lg:px-8'>
              <h3 className='text-xl font-medium'>Secure & Transparent</h3>
              <p className='text-muted-foreground'>
                Ensures that all workflows are secure with encryption and gives you full transparency into the tasks
                your AI performs.
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-6 overflow-hidden py-6 sm:border-l lg:border-x'>
            <SmartWorkflow />
            <div className='space-y-4 px-8'>
              <h3 className='text-xl font-medium'>Smart Workflow Automation</h3>
              <p className='text-muted-foreground'>
                Automates repetitive tasks seamlessly across multiple apps, saving you valuable time and effort every
                single day.
              </p>
            </div>
          </div>

          <div className='group flex flex-col gap-6 overflow-hidden pb-6 max-lg:order-1 max-lg:border-t sm:max-lg:border-r'>
            <CrossPlatform />
            <div className='space-y-4 px-8'>
              <h3 className='text-xl font-medium'>Cross-Platform Synchronisation</h3>
              <p className='text-muted-foreground'>
                Keeps your tools and apps perfectly synced, ensuring consistency and reliability across your entire
                workflow.
              </p>
            </div>
          </div>

          <div className='flex flex-col overflow-hidden border-t pb-6 sm:col-span-2 lg:border-r'>
            <MultiAI />
            <div className='space-y-4 px-8'>
              <h3 className='text-xl font-medium'>Multi-AI Integration</h3>
              <p className='text-muted-foreground'>
                Seamlessly integrates with over 100 popular tools and apps, significantly enhancing your workflow and
                productivity effortlessly every day.
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-6 overflow-hidden border-t py-6 max-lg:order-1'>
            <RealTime />
            <div className='space-y-4 px-8'>
              <h3 className='text-xl font-medium'>Real-Time Notifications </h3>
              <p className='text-muted-foreground'>
                Get instant updates on the status of your workflows, tasks, and deadlines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BentoGrid
