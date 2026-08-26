import type { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeatureStrip from '@/components/FeatureStrip'
import StatsBar from '@/components/StatsBar'

export const metadata: Metadata = {
  title: 'SankalpQ — Learn Quantum Computing Interactively',
  description:
    'SankalpQ is an interactive quantum computing learning platform with structured courses, a drag-and-drop circuit builder, multi-backend simulation, and an AI-powered tutor.',
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureStrip />
        <StatsBar />
      </main>
    </>
  )
}
