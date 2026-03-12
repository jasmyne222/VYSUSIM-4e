'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { ArrowRight } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 py-8 px-4">
      {/* Hero Section - Clear and accessible */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.h1
          className="text-3xl md:text-5xl font-semibold text-foreground text-balance leading-tight tracking-tight"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-primary font-bold">VYSUSIM</span><br />
          Simulateur RH interactif
        </motion.h1>
        
        {/* Duration badge - clear expectation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Durée : environ 30 minutes
        </motion.div>
      </motion.div>

      {/* VyvyBot Introduction - Main guidance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="my-2 max-w-xl"
      >
        <VyvyBot
          message="Bonjour ! Je suis Vyvy, votre guide. Ensemble, nous allons simuler la gestion RH d'une pizzeria. À chaque étape, je vous expliquerai quoi faire. C'est parti !"
          expression="happy"
          size="lg"
        />
      </motion.div>

      {/* Simple steps - very clear for non-tech users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
            Comment ça fonctionne ?
          </h2>
          <div className="space-y-4">
            <StepItem number={1} text="Vous découvrez votre équipe de 4 employés" />
            <StepItem number={2} text="Vous faites face à 3 situations RH réelles" />
            <StepItem number={3} text="À chaque étape, vous choisissez parmi plusieurs options" />
            <StepItem number={4} text="À la fin, un récapitulatif de vos choix est généré" />
          </div>
        </div>
      </motion.div>

      {/* CTA Button - Large and clear */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-4 flex flex-col items-center gap-3"
      >
        <Button
          size="xl"
          onClick={onStart}
          className="group font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          Commencer le simulateur
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Cliquez sur le bouton orange pour démarrer
        </p>
      </motion.div>

      {/* Subtle background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-primary/3 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-tr from-muted/50 to-transparent" />
      </div>
    </div>
  )
}

function StepItem({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
        {number}
      </div>
      <p className="text-foreground">{text}</p>
    </div>
  )
}
