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
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-foreground text-balance"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Bienvenue chez{' '}
          <span className="text-primary">La Pizzeria</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Une experience immersive pour apprendre les bonnes pratiques RH 
          a travers des situations reelles du quotidien.
        </motion.p>
      </motion.div>

      {/* VyvyBot Introduction */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="my-8"
      >
        <VyvyBot
          message="Salut ! Je suis Vyvy, ton guide RH. Ensemble, on va decouvrir comment gerer une equipe dans une pizzeria. Pret a relever le defi ?"
          expression="excited"
          size="lg"
        />
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
      >
        <FeatureCard
          icon={<Users className="w-6 h-6" />}
          title="Gerez votre equipe"
          description="Configurez les contrats et le suivi du temps de travail"
          delay={0.9}
        />
        <FeatureCard
          icon={<Building2 className="w-6 h-6" />}
          title="Vivez le restaurant"
          description="Plongez dans l'ambiance d'une vraie pizzeria"
          delay={1.0}
        />
        <FeatureCard
          icon={<Award className="w-6 h-6" />}
          title="Prenez des decisions"
          description="Faites face a des situations RH reelles"
          delay={1.1}
        />
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-8"
      >
        <Button
          size="lg"
          onClick={onStart}
          className="group px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          Commencer l'aventure
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}
