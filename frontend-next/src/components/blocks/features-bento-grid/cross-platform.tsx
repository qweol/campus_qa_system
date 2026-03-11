'use client'

import { motion } from 'motion/react'

import LogoVector from '@/assets/svg/orion-logo'

const logos = [
  {
    image: '/images/features/01.webp',
    alt: 'Copilot AI Logo'
  },
  {
    image: '/images/features/02.webp',
    alt: 'MidJourney AI Logo'
  },
  {
    image: '/images/features/03.webp',
    alt: 'Gemini AI Logo'
  },
  {
    image: '/images/features/04.webp',
    alt: 'Grok AI Logo'
  },
  {
    image: '/images/features/05.webp',
    alt: 'Claude AI Logo'
  },
  {
    image: '/images/features/06.webp',
    alt: 'Open AI Logo'
  },
  {
    image: '/images/features/07.webp',
    alt: 'Perplexity AI Logo'
  },
  {
    image: '/images/features/08.webp',
    alt: 'DeepSeek AI Logo'
  }
]

const PickYourTool = () => {
  return (
    <div className='relative h-65 overflow-hidden'>
      <svg
        width='143'
        height='100'
        viewBox='0 0 143 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='absolute top-0 left-1/2 -translate-x-1/2'
      >
        <path
          d='M0.5 42.9458V0.5H142.5V42.9458L71.1411 99.2143L0.5 42.9458Z'
          fill='var(--background)'
          fillOpacity='0.2'
          stroke='var(--border)'
        />
      </svg>
      <div className='bg-border absolute top-25 left-1/2 h-36.5 w-px -translate-x-1/2' />

      <div className='bg-primary absolute top-15 left-1/2 grid size-20 -translate-x-1/2 place-content-center rounded-md border shadow-xl'>
        <LogoVector className='size-15.5 text-white dark:text-black' />
      </div>

      <div className='absolute top-10 right-1/2 -translate-x-14.5'>
        <svg width='303' height='303' viewBox='0 0 303 303' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M151.082 1.08203L257.148 45.016L301.082 151.082L257.148 257.148L151.082 301.082L45.016 257.148L1.08203 151.082L45.016 45.016L151.082 1.08203Z'
            stroke='var(--border)'
            strokeWidth='2'
            fill='var(--background)'
            fillOpacity='0.2'
          />
        </svg>
        {[0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((startOffset, index) => {
          return (
            <motion.div
              key={index}
              style={{
                offsetPath: `path("M151.082 1.08203L257.148 45.016L301.082 151.082L257.148 257.148L151.082 301.082L45.016 257.148L1.08203 151.082L45.016 45.016L151.082 1.08203Z")`,
                offsetRotate: '0deg'
              }}
              initial={{ offsetDistance: `${startOffset}%` }}
              animate={{
                offsetDistance: [
                  `${startOffset}%`,
                  `${startOffset}%`,
                  `${startOffset}%`,
                  `${startOffset + 12.5}%`,
                  `${startOffset + 12.5}%`,
                  `${startOffset + 12.5}%`,
                  `${startOffset + 12.5}%`,
                  `${startOffset + 25}%`,
                  `${startOffset + 25}%`,
                  `${startOffset + 25}%`,
                  `${startOffset + 25}%`,
                  `${startOffset + 37.5}%`,
                  `${startOffset + 37.5}%`,
                  `${startOffset + 37.5}%`,
                  `${startOffset + 37.5}%`,
                  `${startOffset + 50}%`,
                  `${startOffset + 50}%`,
                  `${startOffset + 50}%`,
                  `${startOffset + 50}%`,
                  `${startOffset + 62.5}%`,
                  `${startOffset + 62.5}%`,
                  `${startOffset + 62.5}%`,
                  `${startOffset + 62.5}%`,
                  `${startOffset + 75}%`,
                  `${startOffset + 75}%`,
                  `${startOffset + 75}%`,
                  `${startOffset + 75}%`,
                  `${startOffset + 87.5}%`,
                  `${startOffset + 87.5}%`,
                  `${startOffset + 87.5}%`,
                  `${startOffset + 87.5}%`,
                  `${startOffset + 100}%`,
                  `${startOffset + 100}%`
                ]
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [
                  0, 0.03125, 0.0625, 0.09375, 0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.28125, 0.3125, 0.34375, 0.375,
                  0.40625, 0.4375, 0.46875, 0.5, 0.53125, 0.5625, 0.59375, 0.625, 0.65625, 0.6875, 0.71875, 0.75,
                  0.78125, 0.8125, 0.84375, 0.875, 0.90625, 0.9375, 0.96875, 1
                ],
                repeatType: 'loop'
              }}
              className='absolute top-0 left-0'
            >
              <div className='bg-background grid size-10.5 place-content-center rounded-full border shadow-sm'>
                <img src={logos[index].image} alt={logos[index].alt} className='size-6.25 dark:invert' />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className='absolute top-10 left-1/2 translate-x-14.5'>
        <svg width='303' height='303' viewBox='0 0 303 303' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M151.082 1.08203L257.148 45.016L301.082 151.082L257.148 257.148L151.082 301.082L45.016 257.148L1.08203 151.082L45.016 45.016L151.082 1.08203Z'
            stroke='var(--border)'
            strokeWidth='2'
            fill='var(--background)'
            fillOpacity='0.2'
          />
        </svg>
        {[0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((startOffset, index) => {
          return (
            <motion.div
              key={`reverse-${index}`}
              style={{
                offsetPath: `path("M151.082 1.08203L257.148 45.016L301.082 151.082L257.148 257.148L151.082 301.082L45.016 257.148L1.08203 151.082L45.016 45.016L151.082 1.08203Z")`,
                offsetRotate: '0deg'
              }}
              initial={{ offsetDistance: `${startOffset}%` }}
              animate={{
                offsetDistance: [
                  `${startOffset}%`,
                  `${startOffset - 12.5}%`,
                  `${startOffset - 12.5}%`,
                  `${startOffset - 12.5}%`,
                  `${startOffset - 12.5}%`,
                  `${startOffset - 25}%`,
                  `${startOffset - 25}%`,
                  `${startOffset - 25}%`,
                  `${startOffset - 25}%`,
                  `${startOffset - 37.5}%`,
                  `${startOffset - 37.5}%`,
                  `${startOffset - 37.5}%`,
                  `${startOffset - 37.5}%`,
                  `${startOffset - 50}%`,
                  `${startOffset - 50}%`,
                  `${startOffset - 50}%`,
                  `${startOffset - 50}%`,
                  `${startOffset - 62.5}%`,
                  `${startOffset - 62.5}%`,
                  `${startOffset - 62.5}%`,
                  `${startOffset - 62.5}%`,
                  `${startOffset - 75}%`,
                  `${startOffset - 75}%`,
                  `${startOffset - 75}%`,
                  `${startOffset - 75}%`,
                  `${startOffset - 87.5}%`,
                  `${startOffset - 87.5}%`,
                  `${startOffset - 87.5}%`,
                  `${startOffset - 87.5}%`,
                  `${startOffset - 100}%`,
                  `${startOffset - 100}%`,
                  `${startOffset - 100}%`
                ]
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [
                  0, 0.03125, 0.0625, 0.09375, 0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.28125, 0.3125, 0.34375, 0.375,
                  0.40625, 0.4375, 0.46875, 0.5, 0.53125, 0.5625, 0.59375, 0.625, 0.65625, 0.6875, 0.71875, 0.75,
                  0.78125, 0.8125, 0.84375, 0.875, 0.90625, 0.9375, 0.96875, 1
                ],
                repeatType: 'loop'
              }}
              className='absolute top-0 left-0'
            >
              <div className='bg-background grid size-10.5 place-content-center rounded-full border shadow-sm'>
                <img
                  src={logos.reverse()[(index + 3) % logos.length].image}
                  alt={logos.reverse()[(index + 3) % logos.length].alt}
                  className='size-6.25 dark:invert'
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className='from-background pointer-events-none absolute inset-x-0 top-0 h-5 bg-linear-to-b to-transparent' />
      <div className='from-background pointer-events-none absolute inset-y-0 right-0 w-3 bg-linear-to-l to-transparent' />
      <div className='from-background pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-linear-to-t to-transparent' />
      <div className='from-background pointer-events-none absolute inset-y-0 left-0 w-3 bg-linear-to-r to-transparent' />
    </div>
  )
}

export default PickYourTool
