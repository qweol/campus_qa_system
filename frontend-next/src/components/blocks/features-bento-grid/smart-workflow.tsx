'use client'

import { useEffect, useRef, useState } from 'react'

import { LoaderIcon } from 'lucide-react'

const TASK_SEQUENCES = [
  {
    status: 'Searching the web',
    lines: [
      'Initializing web search...',
      'Scanning web pages...',
      'Visiting 5 websites...',
      'Analyzing content...',
      'Generating summary...'
    ]
  },
  {
    status: 'Analyzing results',
    lines: [
      'Analyzing search results...',
      'Generating summary...',
      'Checking for relevant information...',
      'Finalizing analysis...',
      'Setting up lazy loading...',
      'Configuring caching strategies...',
      'Running performance tests...',
      'Finalizing optimizations...'
    ]
  },
  {
    status: 'Enhancing UI/UX',
    lines: [
      'Initializing UI enhancement scan...',
      'Checking accessibility compliance...',
      'Analyzing component animations...',
      'Reviewing loading states...',
      'Testing responsive layouts...',
      'Optimizing user interactions...',
      'Validating color contrast...',
      'Checking motion preferences...',
      'Finalizing UI improvements...'
    ]
  }
]

const OneFlowProcess = () => {
  const [sequenceIndex, setSequenceIndex] = useState(0)

  const [visibleLines, setVisibleLines] = useState<Array<{ text: string; number: number }>>([])

  const [scrollPosition, setScrollPosition] = useState(0)
  const codeContainerRef = useRef<HTMLDivElement>(null)
  const lineHeight = 28

  const currentSequence = TASK_SEQUENCES[sequenceIndex]
  const totalLines = currentSequence.lines.length

  useEffect(() => {
    const initialLines = []

    for (let i = 0; i < Math.min(5, totalLines); i++) {
      initialLines.push({
        text: currentSequence.lines[i],
        number: i + 1
      })
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleLines(initialLines)
    setScrollPosition(0)
  }, [sequenceIndex, currentSequence.lines, totalLines])

  // Handle line advancement
  useEffect(() => {
    const advanceTimer = setInterval(() => {
      // Get the current first visible line index
      const firstVisibleLineIndex = Math.floor(scrollPosition / lineHeight)
      const nextLineIndex = (firstVisibleLineIndex + 3) % totalLines

      // If we're about to wrap around, move to next sequence
      if (nextLineIndex < firstVisibleLineIndex && nextLineIndex !== 0) {
        setSequenceIndex(prevIndex => (prevIndex + 1) % TASK_SEQUENCES.length)

        return
      }

      // Add the next line if needed
      if (nextLineIndex >= visibleLines.length && nextLineIndex < totalLines) {
        setVisibleLines(prevLines => [
          ...prevLines,
          {
            text: currentSequence.lines[nextLineIndex],
            number: nextLineIndex + 1
          }
        ])
      }

      // Scroll to the next line
      setScrollPosition(prevPosition => prevPosition + lineHeight)
    }, 2000) // Slightly slower than the example for better readability

    return () => clearInterval(advanceTimer)
  }, [scrollPosition, visibleLines, totalLines, sequenceIndex, currentSequence.lines, lineHeight])

  // Apply scroll position
  useEffect(() => {
    if (codeContainerRef.current) {
      codeContainerRef.current.scrollTop = scrollPosition
    }
  }, [scrollPosition])

  return (
    <div className='flex items-end justify-center px-6'>
      <div className='w-full space-y-4'>
        <div className='text-muted-foreground flex items-center gap-1.5 px-3 py-1.5 font-medium'>
          <LoaderIcon className='animation-duration-[2s] size-5 animate-spin' />
          <span className='text-sm'>{currentSequence.status}...</span>
        </div>

        <div className='relative overflow-hidden rounded-t-xl'>
          <div
            ref={codeContainerRef}
            className='bg-muted relative flex h-47 w-full flex-col gap-2.5 overflow-hidden px-3 py-4'
            style={{ scrollBehavior: 'smooth' }}
          >
            {visibleLines.map(line => (
              <div key={`${line.number}-${line.text}`} className='flex items-center text-lg font-light'>
                <div className='w-6 pr-3 select-none'>{line.number}.</div>
                <div className='line-clamp-1 flex-1'>{line.text}</div>
              </div>
            ))}
          </div>
          <div className='from-muted pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b to-transparent' />
          <div className='from-muted pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t to-transparent' />
        </div>
      </div>
    </div>
  )
}

export default OneFlowProcess
