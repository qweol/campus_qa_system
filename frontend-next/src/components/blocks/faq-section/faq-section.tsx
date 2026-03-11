'use client'

import { Accordion as AccordionPrimitive } from 'radix-ui'
import { PlusIcon } from 'lucide-react'

import Link from 'next/link'

import SectionHeader from '@/components/blocks/section-header'
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import { PrimaryOrionButton, SecondaryOrionButton } from '@/components/ui/orion-button'

import type { FAQItem } from '@/assets/data/faq'

type FAQSectionProps = {
  faqs: FAQItem[]
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
  // Split FAQs into two columns
  const midPoint = Math.ceil(faqs.length / 2)
  const leftColumnFaqs = faqs.slice(0, midPoint)
  const rightColumnFaqs = faqs.slice(midPoint)

  return (
    <section id='faq'>
      <SectionHeader title='FAQ' description='Essential answers about using and integrating the AI agent.' />
      <div className='border-b px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl border-x'>
          {/* Heading and Buttons */}
          <div className='flex flex-col items-center gap-5 border-b px-4 py-8 text-center md:py-16 lg:py-24'>
            <h3 className='text-2xl font-semibold sm:text-3xl lg:text-4xl'>常见问题解答</h3>
            <p className='text-muted-foreground text-lg'>
              关于系统功能、知识库管理和使用方式的常见问题。
            </p>

            <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4'>
              <PrimaryOrionButton size='lg' className='rounded-lg' asChild>
                <Link href='/chat'>开始使用</Link>
              </PrimaryOrionButton>
              <SecondaryOrionButton size='lg' className='rounded-lg' asChild>
                <Link href='/#features'>查看功能</Link>
              </SecondaryOrionButton>
            </div>
          </div>

          {/* FAQ Accordions */}
          <div className='grid grid-cols-1 gap-0 px-4 py-4 sm:px-8 md:py-16 lg:grid-cols-2 lg:gap-9 lg:py-24'>
            {/* Left Column */}
            <div>
              <p className='text-primary pb-2.5 text-lg font-semibold lg:text-xl'>功能与使用</p>
              <Accordion type='single' collapsible className='w-full' defaultValue='item-1'>
                {leftColumnFaqs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionPrimitive.Header className='flex'>
                      <AccordionPrimitive.Trigger
                        data-slot='accordion-trigger'
                        className='focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 cursor-pointer items-center justify-between gap-4 rounded-md py-4 text-left text-lg font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'
                      >
                        {index + 1}. {item.question}
                        <PlusIcon className='text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200' />
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionContent className='text-muted-foreground text-base'>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right Column */}
            <div className='max-lg:mt-8'>
              <p className='text-primary pb-2.5 text-lg font-semibold lg:text-xl'>技术与实现</p>
              <Accordion type='single' collapsible className='w-full' defaultValue={`item-${midPoint + 3}`}>
                {rightColumnFaqs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${midPoint + index + 1}`}>
                    <AccordionPrimitive.Header className='flex'>
                      <AccordionPrimitive.Trigger
                        data-slot='accordion-trigger'
                        className='focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 cursor-pointer items-center justify-between gap-4 rounded-md py-4 text-left text-lg font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'
                      >
                        {index + 1}. {item.question}
                        <PlusIcon className='text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200' />
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionContent className='text-muted-foreground text-base'>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
