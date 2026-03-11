'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { ArrowRight, Users, Building2, Award } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-10 py-12">
      {/* Hero Section - Swiss corporate style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-semibold text-foreground text-balance leading-tight tracking-tight"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-primary font-bold">VYSUSIM</span><br />
          Simulateur RH pour managers
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          6 minutes pour maitriser les decisions RH critiques. Gerez une pizzeria, relevez des crises reelles, et comprenez pourquoi Vysual est necessaire.
        </motion.p>
      </motion.div>

      {/* VyvyBot Introduction */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="my-4"
      >
        <VyvyBot
          message="Bienvenue dans VYSUSIM ! Vous etes manager d'une pizzeria. Ensemble, affrontons des defis RH reels et voyons comment Vysual peut vous aider."
          expression="happy"
          size="lg"
        />
      </motion.div>

      {/* Features - Clean card design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full"
      >
        <FeatureCard
          icon={<Users className="w-5 h-5" />}
          title="Composez votre equipe"
          description="4 employes avec contrats et roles"
          delay={0.9}
        />
        <FeatureCard
          icon={<Building2 className="w-5 h-5" />}
          title="Affrontez 3 crises RH"
          description="Maternite, accident travail, licenciement"
          delay={1.0}
        />
        <FeatureCard
          icon={<Award className="w-5 h-5" />}
          title="Comprenez le 'pourquoi'"
          description="Contexte HR pour chaque decision"
          delay={1.1}
        />
      </motion.div>

      {/* CTA Button - Vysual style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-6"
      >
        <Button
          size="lg"
          onClick={onStart}
          className="group px-8 py-5 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Commencer
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Subtle background - minimal Swiss style */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-primary/3 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-tr from-muted/50 to-transparent" />
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="p-5 rounded-lg bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}
