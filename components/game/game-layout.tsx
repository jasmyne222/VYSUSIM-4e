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

const screenOrder: GameScreen[] = ['welcome', 'team', 'mission-julie', 'mission-pablo', 'mission-dismissal', 'report']
const screenLabels = ['Bienvenue', 'Équipe', 'Julie', 'Pablo', 'Départs', 'Rapport']

export function GameLayout({ children, currentScreen, showProgress = true }: GameLayoutProps) {
  const currentStep = screenOrder.indexOf(currentScreen)

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-md border-b border-border/60 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Image
              src="/vysual-logo.png"
              alt="Vysual"
              width={220}
              height={70}
              priority
              className="h-16 w-auto"
            />
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

      {/* Main content — scrollable zone only */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-border/60 py-3 bg-muted/30">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Vysual</span>
          <span className="w-1 h-1 rounded-full bg-primary/60" />
          <span>La solution suisse pour la gestion RH</span>
        </div>
      </footer>
    </div>
  )
}
