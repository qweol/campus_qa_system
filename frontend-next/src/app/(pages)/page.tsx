import { faqData } from '@/assets/data/faq'
import { ctaStats } from '@/assets/data/cta'

import HeroSection from '@/components/blocks/hero-section'
import FeaturesSection from '@/components/blocks/features-section'
import HowItWorksSection from '@/components/blocks/how-it-works-section'
import FAQSection from '@/components/blocks/faq-section/faq-section'
import CTASection from '@/components/blocks/cta-section/cta-section'
import Footer from '@/components/layout/footer'

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection faqs={faqData} />
      <CTASection stats={ctaStats} />
      <Footer />
    </>
  )
}

export default Home
