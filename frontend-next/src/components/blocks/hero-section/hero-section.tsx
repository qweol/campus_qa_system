'use client'

import { useEffect, useState } from 'react'

import {
  ArrowUpRightIcon,
  BellRingIcon,
  ClipboardIcon,
  DollarSignIcon,
  FileTextIcon,
  HeadsetIcon,
  RefreshCcwDotIcon,
  TrendingUpIcon
} from 'lucide-react'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedTooltip } from '@/components/ui/motion-tooltip'
import { BorderBeam } from '@/components/ui/border-beam'
import { PrimaryOrionButton, SecondaryOrionButton } from '@/components/ui/orion-button'
import { Rating } from '@/components/ui/rating'

import LeadQualifier from '@/components/blocks/hero-section/lead-qualifier'
import MeetingPrep from '@/components/blocks/hero-section/meeting-prep'
import FollowUps from '@/components/blocks/hero-section/follow-ups'
import DataSync from '@/components/blocks/hero-section/data-sync'
import Reporting from '@/components/blocks/hero-section/reporting'
import ContentDrafting from '@/components/blocks/hero-section/content-drafting'

import { MotionPreset } from '@/components/ui/motion-preset'

const avatars = [
  {
    image: '/images/avatar/7.webp',
    fallback: 'AH',
    name: 'Ali Hussein',
    designation: 'Developer'
  },
  {
    image: '/images/avatar/8.webp',
    fallback: 'SJ',
    name: 'Sahaj Jain',
    designation: 'Software Engineer'
  },
  {
    image: '/images/avatar/3.webp',
    fallback: 'DH',
    name: 'David Haz',
    designation: 'Design Engineer'
  },
  {
    image: '/images/avatar/6.webp',
    fallback: 'J',
    name: 'Julian',
    designation: 'Senior Developer'
  }
]

const tabs = [
  {
    name: 'Lead Qualifier',
    value: 'lead-qualifier',
    icon: TrendingUpIcon,
    content: <LeadQualifier />
  },
  {
    name: 'Meeting Prep',
    value: 'meeting-prep',
    icon: HeadsetIcon,
    content: <MeetingPrep />
  },
  {
    name: 'Follow-ups',
    value: 'follow-ups',
    icon: BellRingIcon,
    content: <FollowUps />
  },
  {
    name: 'Data Sync',
    value: 'data-sync',
    icon: RefreshCcwDotIcon,
    content: <DataSync />
  },
  {
    name: 'Reporting',
    value: 'reporting',
    icon: ClipboardIcon,
    content: <Reporting />
  },
  {
    name: 'Content Drafting',
    value: 'content-drafting',
    icon: FileTextIcon,
    content: <ContentDrafting />
  }
]

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || 'lead-qualifier')

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(currentTab => {
        const currentIndex = tabs.findIndex(tab => tab.value === currentTab)
        const nextIndex = (currentIndex + 1) % tabs.length

        return tabs[nextIndex].value
      })
    }, 7000)

    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <section id='home' className='relative -mt-15.75 flex flex-col overflow-hidden pt-15.75'>
      <div className='border-b px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-7xl flex-col gap-6 border-x px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-24'>
          <div className='flex flex-col items-center gap-6 text-center'>
            <MotionPreset fade blur transition={{ duration: 0.5 }} className='space-y-4'>
              <Badge variant='outline' className='bg-muted relative gap-2.5 px-1.5 py-1'>
                <span className='bg-primary text-primary-foreground flex h-5.5 items-center rounded-full px-2 py-0.5'>
                  🔥 New
                </span>
                <span className='text-muted-foreground text-sm font-normal text-wrap'>Introducing AI Agent</span>
                <BorderBeam colorFrom='var(--primary)' colorTo='var(--primary)' size={35} />
              </Badge>

              <h1 className='text-2xl font-semibold sm:text-3xl lg:text-5xl lg:leading-[1.29167]'>
                Work with AI agent
                <br />
                that handles your daily operations
              </h1>

              <p className='text-muted-foreground max-w-3xl text-xl'>
                Automate routine tasks, connect your tools, and let your AI agent coordinate workflows so you can focus
                on strategy, not busywork.
              </p>
            </MotionPreset>

            <MotionPreset fade blur delay={0.1} transition={{ duration: 0.5 }}>
              <div className='flex flex-wrap items-center justify-center gap-4'>
                <PrimaryOrionButton size='lg' className='rounded-lg max-[425px]:has-[>svg]:px-4' asChild>
                  <Link href='/register'>
                    <ArrowUpRightIcon />
                    Get Started
                  </Link>
                </PrimaryOrionButton>
                <SecondaryOrionButton size='lg' className='rounded-lg max-[425px]:has-[>svg]:px-4' asChild>
                  <Link href='#pricing'>
                    <DollarSignIcon />
                    View Pricing
                  </Link>
                </SecondaryOrionButton>
              </div>
            </MotionPreset>
          </div>

          <MotionPreset fade blur delay={0.2} transition={{ duration: 0.5 }}>
            <div className='flex w-full items-center justify-center gap-4 max-sm:flex-col sm:gap-7'>
              <div className='flex flex-1 items-center justify-end gap-3'>
                <div className='flex flex-row items-center justify-center'>
                  <AnimatedTooltip
                    items={avatars}
                    className='*:data-[slot=avatar]:border-background -me-3.5 last:me-0 *:data-[slot=avatar]:border-2 *:data-[slot=avatar]:shadow-md *:data-[slot=avatar]:ring-0'
                  />
                </div>
                <div>
                  <span className='text-lg font-medium'>12K+</span> <span className='text-muted-foreground'>Users</span>
                </div>
              </div>

              <Separator orientation='vertical' className='data-[orientation=vertical]:h-4 max-sm:hidden' />

              <div className='flex flex-1 items-center gap-3'>
                <Rating readOnly value={4.5} precision={0.5} className='[&_svg]:text-primary' />
                <div>
                  <span className='text-lg font-medium'>4.5</span>{' '}
                  <span className='text-muted-foreground'>Ratings</span>
                </div>
              </div>
            </div>
          </MotionPreset>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='block w-full gap-0'>
        <div className='border-b px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-7xl border-x'>
            {/* Tabs List */}
            <ScrollArea className='-m-px'>
              <TabsList className='w-full -space-x-px rounded-none bg-transparent p-0'>
                {tabs.map(({ icon: Icon, name, value }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className='border-border text-foreground focus-visible:outline-primary/20 data-[state=active]:border-primary/60! data-[state=active]:bg-muted! h-15 flex-1 cursor-pointer rounded-none px-4 py-2.5 text-base focus-visible:ring-0 focus-visible:outline-[3px] focus-visible:-outline-offset-4 data-[state=active]:z-1'
                  >
                    <Icon />
                    {name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation='horizontal' className='z-2' />
            </ScrollArea>
          </div>
        </div>

        <div className='px-4 sm:px-6 lg:px-8'>
          <div className='relative mx-auto h-151 max-w-7xl border-x'>
            {/* Background Dots */}
            <div className='pointer-events-none absolute inset-0 -z-2 bg-[radial-gradient(color-mix(in_oklab,var(--primary)10%,transparent)_2px,transparent_2px)] bg-size-[20px_20px] bg-fixed' />

            {/* Background Gradient Overlay */}
            <div className='bg-background pointer-events-none absolute inset-0 -z-1 flex items-center justify-center mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]' />

            <ScrollArea className='h-full *:data-[slot=scroll-area-viewport]:h-full [&>[data-slot=scroll-area-viewport]>div]:h-full'>
              {tabs.map(tab => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className='flex h-full items-center justify-center p-4 sm:p-6 lg:p-8'
                >
                  {tab.content}
                </TabsContent>
              ))}

              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>
        </div>
      </Tabs>
    </section>
  )
}

export default HeroSection
