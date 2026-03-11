'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ProgressIndicator } from './screen-transition'
import type { GameScreen } from '@/lib/types/game'

interface GameLayoutProps {
  children: React.ReactNode
  currentScreen: GameScreen
  showProgress?: boolean
}

const screenOrder: GameScreen[] = ['welcome', 'team', 'restaurant', 'mission-julie', 'mission-pablo', 'mission-dismissal', 'report']
const screenLabels = ['Bienvenue', 'Equipe', 'Restaurant', 'Julie', 'Pablo', 'Departs', 'Rapport']

export function GameLayout({ children, currentScreen, showProgress = true }: GameLayoutProps) {
  const currentStep = screenOrder.indexOf(currentScreen)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Clean Vysual.ch style */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Image
              src="/vysual-logo.png"
              alt="Vysual"
              width={100}
              height={32}
              priority
              className="h-7 w-auto"
            />
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-px h-4 bg-border" />
              <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Serious Game</p>
            </div>
          </motion.div>

          {/* Progress indicator */}
          {showProgress && currentScreen !== 'welcome' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block"
            >
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={screenOrder.length}
                labels={screenLabels}
              />
            </motion.div>
          )}

          {/* Mobile step indicator */}
          {showProgress && currentScreen !== 'welcome' && (
            <div className="md:hidden text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded">
              {currentStep + 1} / {screenOrder.length}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-10">
        {children}
      </main>

      {/* Footer - Minimal Vysual style */}
      <footer className="border-t border-border/60 py-4 bg-muted/30">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Vysual</span>
          <span className="w-1 h-1 rounded-full bg-primary/60" />
          <span>Formation RH interactive</span>
        </div>
      </footer>
    </div>
  )
}
