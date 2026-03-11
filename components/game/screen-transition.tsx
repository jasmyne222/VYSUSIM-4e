'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { GameScreen } from '@/lib/types/game'

interface ScreenTransitionProps {
  children: React.ReactNode
  screenKey: GameScreen
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

export function ScreenTransition({ children, screenKey }: ScreenTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Progress indicator for game flow
interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index < currentStep
                ? 'bg-primary border-primary'
                : index === currentStep
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/30 bg-muted'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {index < currentStep ? (
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                className="w-4 h-4 text-primary-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <motion.path
                  d="M5 12l5 5L20 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.svg>
            ) : (
              <span
                className={`text-xs font-semibold ${
                  index === currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {index + 1}
              </span>
            )}
          </motion.div>

          {index < totalSteps - 1 && (
            <motion.div
              className={`w-8 h-0.5 mx-1 ${
                index < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.1 }}
            />
          )}
        </div>
      ))}

      {labels && labels[currentStep] && (
        <motion.span
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="ml-3 text-sm font-medium text-foreground"
        >
          {labels[currentStep]}
        </motion.span>
      )}
    </div>
  )
}
