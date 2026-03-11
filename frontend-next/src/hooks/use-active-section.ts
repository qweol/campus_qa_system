'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

export const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState<string>('')
  const [isScrolling, setIsScrolling] = useState(false)

  const pathname = usePathname()

  // Reset active section when pathname changes (route navigation)
  useEffect(() => {
    setActiveSection('')
  }, [pathname])

  // Scroll to hash on mount or when pathname changes
  useEffect(() => {
    const hash = window.location.hash.slice(1) // Remove the '#'

    if (hash && sectionIds.includes(hash)) {
      setIsScrolling(true)

      const scrollToElement = () => {
        const element = document.getElementById(hash)

        if (element) {
          // Get the navbar height (4rem = 64px which matches scroll-mt-16)
          const navbarHeight = 64
          const elementPosition = element.getBoundingClientRect().top + window.scrollY
          const offsetPosition = elementPosition - navbarHeight

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })

          // Wait for smooth scroll to complete before re-enabling intersection observer
          setTimeout(() => {
            setIsScrolling(false)
            setActiveSection(hash)
          }, 1000) // Smooth scroll typically takes ~500-800ms
        }
      }

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        // Add a small delay to ensure all content is rendered
        setTimeout(scrollToElement, 100)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]) // Re-run when pathname changes (includes navigation from other pages)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // Don't update active section while programmatically scrolling
        if (isScrolling) return

        // Find all visible sections
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            // Sort by how much of the section is visible (intersection ratio)
            // and by position on screen (top edge)
            const ratioComparison = b.intersectionRatio - a.intersectionRatio

            if (ratioComparison !== 0) return ratioComparison

            return a.boundingClientRect.top - b.boundingClientRect.top
          })

        // Set the most visible section as active, or clear if none are visible
        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id)
        } else {
          setActiveSection('')
        }
      },
      {
        rootMargin: '-64px 0px -90% 0px', // Match navbar height (64px = 4rem)
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] // Multiple thresholds for better detection
      }
    )

    // Observe all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(id)

      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [sectionIds, pathname, isScrolling])

  return activeSection
}
