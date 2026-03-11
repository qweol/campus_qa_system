'use client'

import { useRef, useState } from 'react'

import { ArrowUpRightIcon, CheckIcon, ChevronDownIcon, PaperclipIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'

import { Marquee } from '@/components/ui/marquee'

const models = [
  {
    id: 1,
    src: '/images/features/20.webp',
    name: 'Gemini 3'
  },
  {
    id: 2,
    src: '/images/features/17.webp',
    name: 'GPT-5-mini'
  },
  {
    id: 3,
    src: '/images/features/18.webp',
    name: 'Claude 4.5 Sonnet'
  }
]

const BuildThings = () => {
  const [inputValue, setInputValue] = useState('')
  const [selectedModel, setSelectedModel] = useState(models[1])

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className='relative flex min-h-75 items-center justify-center overflow-hidden p-6'>
      <div className='absolute inset-0 flex flex-col justify-between'>
        {/* Row 1 */}
        <Marquee gap={2.75} duration={25} className='[&>div]:running py-0'>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/19.webp' alt='Service Logo' className='w-full dark:invert' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/15.webp' alt='Cloud Service' className='w-full dark:invert' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/16.webp' alt='Platform Logo' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/17.webp' alt='App Logo' className='w-full dark:invert' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/18.webp' alt='Service Icon' className='w-full' />
          </div>
        </Marquee>
        {/* Row 2 */}
        <Marquee gap={2.75} duration={30} reverse className='[&>div]:running py-0'>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/25.webp' alt='Productivity App' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/11.webp' alt='Chat Platform' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/12.webp' alt='Design Tool' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/13.webp' alt='Writing Tool' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/14.webp' alt='Integration Service' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/10.webp' alt='Publishing Platform' className='w-full' />
          </div>
        </Marquee>
        {/* Row 3 */}
        <Marquee gap={2.75} duration={25} className='[&>div]:running py-0'>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/24.webp' alt='Creative App' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/23.webp' alt='Communication Tool' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/22.webp' alt='Development Tool' className='w-full dark:invert' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/21.webp' alt='Design Platform' className='w-full' />
          </div>
          <div className='bg-background flex size-15.5 items-center justify-center rounded-full border shadow-sm'>
            <img src='/images/features/09.webp' alt='Automation Tool' className='w-full' />
          </div>
        </Marquee>
      </div>
      <div className='group/prompt bg-card relative w-full max-w-121 flex-col gap-8 overflow-hidden rounded-xl border shadow-md'>
        <Textarea
          id='features-text-prompt'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder='What can i do for you?'
          className='bg-card! mb-13 field-sizing-content max-h-30 min-h-31.5 resize-none rounded-xl border-0 p-4 text-lg! shadow-none focus-visible:ring-0'
        />
        <div className='absolute inset-x-4 bottom-4 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm'>
                  <img src={selectedModel.src} alt={selectedModel.name} className='size-6.5' />
                  <span>{selectedModel.name}</span>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-50'>
                {models.map(model => (
                  <DropdownMenuItem key={model.id} onClick={() => setSelectedModel(model)}>
                    <div className='flex items-center gap-2'>
                      <img src={model.src} alt={model.name} className='size-6.5' />
                      <span>{model.name}</span>
                    </div>
                    {selectedModel.id === model.id && <CheckIcon className='ml-auto' />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className='bg-border h-5 w-px' />
            <Button
              size='icon'
              className='bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 size-7!'
            >
              <PaperclipIcon />
              <span className='sr-only'>Attach a file</span>
            </Button>
          </div>
          <Button size='icon' className='size-7!' disabled={inputValue.trim() === ''}>
            <ArrowUpRightIcon />
            <span className='sr-only'>Open in new tab</span>
          </Button>
        </div>
      </div>

      <div className='from-background pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b to-transparent' />
      <div className='from-background pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l to-transparent' />
      <div className='from-background pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent' />
      <div className='from-background pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r to-transparent' />
    </div>
  )
}

export default BuildThings
