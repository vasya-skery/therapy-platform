import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Statistics from '@/components/Statistics'
import HowItWorks from '@/components/HowItWorks'
import Team from '@/components/Team'
import Reviews from '@/components/Reviews'
import Topics from '@/components/Topics'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Statistics />
      <HowItWorks />
      <Team />
      <Reviews />
      <Topics />
      <FAQ />
      <Footer />
    </main>
  )
}
