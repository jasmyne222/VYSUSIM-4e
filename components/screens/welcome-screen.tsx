'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { ArrowRight, Clock, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-start gap-6 py-4 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold text-foreground text-balance leading-tight tracking-tight"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-primary">VYSUSIM</span><br />
          <span className="text-foreground text-xl md:text-2xl font-semibold">Diagnostic RH interactif</span>
        </motion.h1>
        
        {/* Duration badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-medium"
        >
          <Clock className="w-4 h-4 text-primary" />
          Durée : environ 30 minutes
        </motion.div>
      </motion.div>

      {/* CTA Button - Moved higher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-2"
      >
        <Button
          size="xl"
          onClick={onStart}
          className="group font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all px-8"
        >
          Commencer le diagnostic
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* VyvyBot Introduction */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-lg"
      >
        <VyvyBot
          message="Bonjour ! Je suis Vyvy, votre guide. Ensemble, nous allons configurer la gestion RH de votre pizzeria. Je vous accompagne à chaque étape !"
          expression="happy"
          size="md"
        />
      </motion.div>

      {/* Why this matters - Cognitive bias: Loss aversion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Pourquoi bien remplir ce diagnostic ?
          </h2>
          
          {/* Stats grid - Loss aversion bias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <StatCard 
              value="25-30%"
              label="des clients nécessitent des ajustements tardifs"
              icon={<TrendingDown className="w-5 h-5" />}
              color="text-red-600"
            />
            <StatCard 
              value="10-15h"
              label="de temps perdu en moyenne par projet incomplet"
              icon={<Clock className="w-5 h-5" />}
              color="text-amber-600"
            />
            <StatCard 
              value="2000-3000 CHF"
              label="de coûts supplémentaires évitables"
              icon={<AlertTriangle className="w-5 h-5" />}
              color="text-red-600"
            />
          </div>

          {/* Positive framing - Gain */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">En remplissant correctement ce diagnostic :</p>
              <p className="text-sm text-green-700 mt-1">
                Vous évitez les allers-retours, votre solution est configurée parfaitement dès le départ, 
                et vous économisez du temps et de l'argent.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  )
}

function StatCard({ value, label, icon, color }: { value: string; label: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 text-center">
      <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground leading-tight mt-1">{label}</p>
    </div>
  )
}
