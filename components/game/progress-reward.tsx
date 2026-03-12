'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Trophy, Clock, Coins, Zap, Star } from 'lucide-react'

interface ProgressRewardProps {
  currentStep: number
  totalSteps: number
  missionName: string
  selectedOption: string | null
  answeredCount: number // total answers given across all steps so far
}

const SELECTION_MESSAGES = [
  "Bonne décision !",
  "Choix enregistré.",
  "Bien joué !",
  "Votre profil se précise.",
]

export function ProgressReward({ currentStep, totalSteps, missionName, selectedOption, answeredCount }: ProgressRewardProps) {
  const [prevAnswered, setPrevAnswered] = useState(answeredCount)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Trigger feedback animation whenever a new answer is given
  useEffect(() => {
    if (answeredCount > prevAnswered) {
      const msg = SELECTION_MESSAGES[answeredCount % SELECTION_MESSAGES.length]
      setFeedbackMsg(msg)
      setShowFeedback(true)
      setPrevAnswered(answeredCount)
      const t = setTimeout(() => setShowFeedback(false), 2000)
      return () => clearTimeout(t)
    }
  }, [answeredCount, prevAnswered])

  // Progress based on answers given, not just current step
  const stepsCompleted = currentStep // steps fully validated
  const currentHasAnswer = !!selectedOption
  const totalAnswered = stepsCompleted + (currentHasAnswer ? 1 : 0)
  const progress = (totalAnswered / totalSteps) * 100
  const isAllComplete = totalAnswered === totalSteps

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* Header + live feedback */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-foreground">{missionName}</span>
        <AnimatePresence mode="wait">
          {showFeedback ? (
            <motion.span
              key="feedback"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1 text-xs font-bold text-primary"
            >
              <Zap className="w-3 h-3" />
              {feedbackMsg}
            </motion.span>
          ) : (
            <motion.span
              key="count"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-bold text-sm"
            >
              {totalAnswered}/{totalSteps}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar — fills on each answer */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Step indicators with per-answer fill */}
      <div className="flex justify-between gap-1">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isValidated = index < currentStep
          const isCurrent = index === currentStep
          const isAnswered = isCurrent && currentHasAnswer
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {isValidated ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </motion.div>
              ) : isAnswered ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  <Star className="w-5 h-5 text-primary fill-primary" />
                </motion.div>
              ) : isCurrent ? (
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <Circle className="w-5 h-5 text-primary fill-primary/20" />
                </motion.div>
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/30" />
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom message */}
      <AnimatePresence mode="wait">
        {isAllComplete ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm bg-green-50 text-green-700 rounded-lg p-2"
          >
            <Trophy className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">Mission complétée ! Cliquez sur Suivant.</span>
          </motion.div>
        ) : currentHasAnswer && !showFeedback ? (
          <motion.p
            key="next"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground text-center"
          >
            Réponse enregistrée — cliquez sur <span className="font-medium text-foreground">Étape suivante</span> pour continuer
          </motion.p>
        ) : !currentHasAnswer ? (
          <motion.p
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground text-center"
          >
            {totalSteps - currentStep} décision{totalSteps - currentStep > 1 ? 's' : ''} restante{totalSteps - currentStep > 1 ? 's' : ''}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// Savings calculator — shown on report screen
export function SavingsIndicator({ questionsAnswered, totalQuestions }: { questionsAnswered: number; totalQuestions: number }) {
  const completionRate = questionsAnswered / totalQuestions
  const timeSaved = Math.round(completionRate * 12.5)
  const moneySaved = Math.round(completionRate * 2500)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-green-50 border border-green-200 rounded-lg p-4"
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
            <p className="text-xs text-green-600">de coûts évités</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
