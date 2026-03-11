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
      {/* Header with logo and progress */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Image
              src="/vysual-logo.png"
              alt="Vysual HR Logo"
              width={120}
              height={40}
              priority
              className="h-8 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">Serious Game</p>
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
            <div className="md:hidden text-sm text-muted-foreground">
              {currentStep + 1} / {screenOrder.length}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          Vysual HR - Formation RH interactive
        </div>
      </footer>
    </div>
  )
}
