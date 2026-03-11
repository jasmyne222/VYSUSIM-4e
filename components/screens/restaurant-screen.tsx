'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { RestaurantScene } from '@/components/game/restaurant-scene'
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'

interface RestaurantScreenProps {
  onNext: () => void
  onBack: () => void
}

export function RestaurantScreen({ onNext, onBack }: RestaurantScreenProps) {
  const [showCrisis, setShowCrisis] = useState(false)
  const [highlightedCharacter, setHighlightedCharacter] = useState<string | null>(null)
  const [vyvyMessage, setVyvyMessage] = useState(
    "Bienvenue dans ta pizzeria ! Tout semble calme... pour l'instant. Clique sur un personnage pour interagir."
  )

  const handleCharacterClick = (name: string) => {
    setHighlightedCharacter(name)
    
    const messages: Record<string, string> = {
      maria: "Maria gere la cuisine depuis 5 ans. Elle connait tous les secrets des meilleures pizzas !",
      pablo: "Pablo est serveur depuis 3 ans. Toujours le sourire, les clients l'adorent !",
      julie: "Julie vient d'arriver. C'est sa premiere semaine... elle semble un peu perdue.",
      carlos: "Carlos manage l'equipe. Il doit jongler entre le service et la gestion RH."
    }
    
    setVyvyMessage(messages[name] || "Clique sur un personnage pour en savoir plus.")
  }

  const triggerCrisis = () => {
    setShowCrisis(true)
    setHighlightedCharacter('julie')
    setVyvyMessage(
      "Oh non ! Julie a un probleme. Elle hesite a te parler... Il semblerait qu'elle ait des soucis avec ses horaires. C'est le moment d'intervenir !"
    )
  }

  return (
    <div className="space-y-8">
      {/* Header - Vysual style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          La Pizzeria
        </h2>
        <p className="text-muted-foreground text-sm">
          Un mardi soir ordinaire... ou presque
        </p>
      </motion.div>

      {/* Main content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* VyvyBot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 order-2 lg:order-1"
        >
          <div className="sticky top-24 space-y-4">
            <VyvyBot
              message={vyvyMessage}
              expression={showCrisis ? 'thinking' : 'happy'}
              size="md"
            />
            
            {!showCrisis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={triggerCrisis}
                >
                  <AlertCircle className="mr-2 w-4 h-4" />
                  Passer a la crise
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Restaurant Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 order-1 lg:order-2"
        >
          <RestaurantScene
            highlightedCharacter={highlightedCharacter as any}
            characterExpressions={{
              maria: 'happy',
              pablo: 'neutral',
              julie: showCrisis ? 'worried' : 'excited',
              carlos: 'neutral'
            }}
            onCharacterClick={handleCharacterClick}
          />

          {/* Crisis alert banner - Professional style */}
          {showCrisis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">Situation detectee</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Julie semble avoir des difficultes avec la gestion de ses horaires. 
                    En tant que responsable RH, vous devez intervenir pour comprendre et resoudre la situation.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between pt-6"
      >
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour
        </Button>
        <Button onClick={onNext} disabled={!showCrisis}>
          {showCrisis ? "Gerer la crise" : "Attendez la crise..."}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}
