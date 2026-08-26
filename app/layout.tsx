import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'SankalpQ — Interactive Quantum Computing Learning Platform',
  description:
    'SankalpQ is an all-in-one interactive platform to learn quantum computing, build circuits, run simulations, and get AI-powered assistance. Built for Smart India Hackathon 2026.',
  keywords: [
    'quantum computing',
    'quantum algorithms',
    'quantum learning',
    'circuit builder',
    'quantum simulation',
    'AI tutor',
    'smart education',
    'SIH 2026',
  ],
  authors: [{ name: 'SankalpQ Team' }],
  openGraph: {
    title: 'SankalpQ — Interactive Quantum Computing Learning Platform',
    description:
      'Learn quantum computing with structured courses, a circuit builder, multi-backend simulation, and an AI Tutor.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Geist fonts via CDN — avoids next/font module resolution issues */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-geist-sans: 'Inter', system-ui, sans-serif;
            --font-geist-mono: 'JetBrains Mono', monospace;
          }
        `}</style>
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="sankalpq-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
