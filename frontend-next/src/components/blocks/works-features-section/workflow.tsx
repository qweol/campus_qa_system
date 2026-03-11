'use client'

import { useEffect, useState } from 'react'

import { motion } from 'motion/react'
import {
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon,
  FileDownIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PaperclipIcon
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const models = [
  {
    id: 1,
    src: '/images/workflow/01.webp',
    name: 'Gemini 3'
  },
  {
    id: 2,
    src: '/images/workflow/02.webp',
    name: 'GPT-5-mini'
  },
  {
    id: 3,
    src: '/images/workflow/03.webp',
    name: 'Claude 4.5 Sonnet'
  }
]

const connectingItems = [
  {
    id: 1,
    text: 'Checking Content',
    image: '/images/hero-section/notion-white.webp'
  },
  {
    id: 2,
    text: 'Working on insights',
    image: '/images/hero-section/06.webp'
  },
  {
    id: 3,
    text: 'Checking permissions and updates',
    image: '/images/hero-section/07.webp'
  },
  {
    id: 4,
    text: 'Checking connections',
    image: '/images/workflow/04.webp'
  }
]

const STEP_DURATION = 4000

const Workflow = ({
  activeTab,
  setActiveTab,
  setWorkflowProgress,
  initialTabId
}: {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  setWorkflowProgress: React.Dispatch<React.SetStateAction<number>>
  initialTabId: string
}) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedModel, setSelectedModel] = useState(models[1])
  const [isLoading, setIsLoading] = useState(false)
  const [showConnecting, setShowConnecting] = useState(false)
  const [showExecutionSummary, setShowExecutionSummary] = useState(false)

  const fullText = 'Summarize daily team updates from Slack and email'

  const handleDescribeWorkflow = (cleanup: () => void) => {
    setActiveTab(initialTabId)
    setInputValue('')
    setIsLoading(false)
    setShowConnecting(false)
    setShowExecutionSummary(false)

    const characters = fullText.split('')
    let currentCharIndex = 0

    const typingInterval = setInterval(() => {
      if (currentCharIndex < characters.length) {
        setInputValue(characters.slice(0, currentCharIndex + 1).join(''))
        currentCharIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, STEP_DURATION / characters.length)

    // Register cleanup for this interval
    cleanup()

    return typingInterval
  }

  const handleConnectTools = () => {
    setActiveTab('connect-tools')
    setInputValue(fullText)
    setIsLoading(true)
    setShowConnecting(true)
    setShowExecutionSummary(false)
  }

  const handleReviewAndRefine = () => {
    setActiveTab('review-and-refine')
    setInputValue('Workflow completed successfully')
    setIsLoading(false)
    setShowConnecting(false)
    setShowExecutionSummary(true)
  }

  useEffect(() => {
    let activeIntervals: NodeJS.Timeout[] = []
    let currentAnimationFrameId: number | null = null
    let isRunning = false

    const clearAllIntervals = () => {
      activeIntervals.forEach(interval => clearInterval(interval))
      activeIntervals = []

      if (currentAnimationFrameId !== null) {
        cancelAnimationFrame(currentAnimationFrameId)
        currentAnimationFrameId = null
      }
    }

    // Determine starting step based on activeTab
    const getStartingStep = () => {
      if (activeTab === 'connect-tools') return 2
      if (activeTab === 'review-and-refine') return 3

      return 1 // initialTabId (describe-workflow)
    }

    const runWorkflow = (startStep: number = 1) => {
      if (isRunning) return
      isRunning = true

      clearAllIntervals()
      let step = startStep - 1 // We'll increment it first in runStep

      const runStep = () => {
        step++

        if (step > 3) {
          setTimeout(() => {
            isRunning = false
            runWorkflow()
          }, 1000)

          return
        }

        // Execute the appropriate step function
        let stepInterval: NodeJS.Timeout | undefined

        if (step === 1) {
          stepInterval = handleDescribeWorkflow(clearAllIntervals)
        } else if (step === 2) {
          handleConnectTools()
        } else if (step === 3) {
          handleReviewAndRefine()
        }

        if (stepInterval) {
          activeIntervals.push(stepInterval)
        }

        // Animate progress from 0 to 100 over STEP_DURATION
        setWorkflowProgress(0)

        const startTime = Date.now()

        const animateProgress = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min((elapsed / STEP_DURATION) * 100, 100)

          setWorkflowProgress(progress)

          if (progress < 100) {
            currentAnimationFrameId = requestAnimationFrame(animateProgress)
          } else {
            currentAnimationFrameId = null

            // Move to next step after current step completes
            runStep()
          }
        }

        currentAnimationFrameId = requestAnimationFrame(animateProgress)
      }

      runStep()
    }

    // Start workflow from the clicked tab's step
    const startingStep = getStartingStep()

    runWorkflow(startingStep)

    return () => {
      clearAllIntervals()
      isRunning = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  return (
    <div
      className={cn(
        'bg-background relative z-1 w-full max-w-99 flex-col rounded-xl shadow-lg',
        showExecutionSummary
          ? 'bg-[color-mix(in_oklab,var(--color-green-600)_30%,var(--card))] dark:bg-[color-mix(in_oklab,var(--color-green-400)_30%,var(--card))]'
          : 'bg-[color-mix(in_oklab,var(--color-sky-600)_30%,var(--card))] dark:bg-[color-mix(in_oklab,var(--color-sky-400)_30%,var(--card))]'
      )}
    >
      {(showConnecting || showExecutionSummary) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='overflow-hidden'
        >
          <motion.div
            transition={{ duration: 0.5 }}
            className={cn('flex items-center justify-between rounded-t-xl p-3 pb-2')}
          >
            <motion.span
              transition={{ duration: 0.5 }}
              className={cn(
                'text-sm font-medium',
                showExecutionSummary ? 'text-green-600 dark:text-green-400' : 'text-sky-600 dark:text-sky-400'
              )}
            >
              {showExecutionSummary ? 'Execution Summary' : 'Connecting tools'}
            </motion.span>
            <MoreVerticalIcon
              className={cn(
                'size-4',
                showExecutionSummary ? 'text-green-600 dark:text-green-400' : 'text-sky-600 dark:text-sky-400'
              )}
            />
          </motion.div>
        </motion.div>
      )}
      <div className='bg-card rounded-t-xl border border-b-0! p-4 pb-2.5'>
        <Textarea
          id='works-text-prompt'
          value={inputValue}
          onChange={() => setInputValue(inputValue)}
          placeholder='What can i do for you?'
          className='bg-card! field-sizing-content min-h-10 w-full resize-none rounded-none border-0 p-0 text-lg! shadow-none focus-visible:ring-0'
        />
      </div>
      <div className='bg-card rounded-b-xl border border-t-0! p-4 pt-0'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm'>
                  <img src={selectedModel.src} alt={selectedModel.name} className='size-4.5' />
                  <span>{selectedModel.name}</span>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-50'>
                {models.map(model => (
                  <DropdownMenuItem key={model.id} onClick={() => setSelectedModel(model)}>
                    <div className='flex items-center gap-2'>
                      <img src={model.src} alt={model.name} className='size-4.5' />
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
            {showExecutionSummary ? (
              <CheckIcon />
            ) : isLoading ? (
              <Loader2Icon className='animate-spin' />
            ) : (
              <ArrowUpRightIcon />
            )}
            <span className='sr-only'>Send to LLM</span>
          </Button>
        </div>
        {showConnecting && !showExecutionSummary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className='mt-6 space-y-3 overflow-hidden'
          >
            {connectingItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.3 }}
                className='flex items-center gap-2.5 text-sm'
              >
                <img src={item.image} alt={item.text} className='size-full max-h-3.5 max-w-3.5' />
                <span className='text-muted-foreground'>
                  {item.id}. {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
        {showExecutionSummary && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className='mt-6'
          >
            <Button variant='ghost' size='sm' className='text-muted-foreground'>
              Save
              <FileDownIcon className='size-3.5' />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Workflow
