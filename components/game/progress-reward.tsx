'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Trophy, Clock, Coins } from 'lucide-react'

interface ProgressRewardProps {
  currentStep: number
  totalSteps: number
  missionName: string
}

export function ProgressReward({ currentStep, totalSteps, missionName }: ProgressRewardProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100
  const isComplete = currentStep === totalSteps - 1

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-foreground">{missionName}</span>
          <span className="text-primary font-bold">{currentStep + 1}/{totalSteps}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            {index < currentStep ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : index === currentStep ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Circle className="w-5 h-5 text-primary fill-primary/20" />
              </motion.div>
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>

      {/* Motivation message */}
      {isComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm bg-green-50 text-green-700 rounded-lg p-2"
        >
          <Trophy className="w-4 h-4" />
          <span className="font-medium">Mission complétée !</span>
        </motion.div>
      ) : (
        <p className="text-xs text-muted-foreground text-center">
          Plus que {totalSteps - currentStep - 1} étape{totalSteps - currentStep - 1 > 1 ? 's' : ''} pour terminer cette mission
        </p>
      )}
    </div>
  )
}

// Savings calculator component - shows what user saves by filling correctly
export function SavingsIndicator({ questionsAnswered, totalQuestions }: { questionsAnswered: number; totalQuestions: number }) {
  // Based on Vysual data: incomplete forms cost 10-15h extra and 2000-3000 CHF
  const completionRate = questionsAnswered / totalQuestions
  const timeSaved = Math.round(completionRate * 12.5) // Average of 10-15h
  const moneySaved = Math.round(completionRate * 2500) // Average of 2000-3000 CHF

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
    >
      <p className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
        <Trophy className="w-4 h-4" />
        En remplissant correctement, vous économisez :
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-lg font-bold text-green-700">~{timeSaved}h</p>
            <p className="text-xs text-green-600">de temps</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-lg font-bold text-green-700">~{moneySaved} CHF</p>
            <p className="text-xs text-green-600">de coûts</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
