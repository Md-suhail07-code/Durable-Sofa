import React from 'react'
import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/Hero'
import { CategoryMarquee } from '@/components/CategoryMarquee'
import { Footer } from '@/components/Footer'
import { WhyChooseUs } from '@/components/WhyChooseUs'

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <CategoryMarquee />
      <Footer />
    </div>
  )
}

export default Home
