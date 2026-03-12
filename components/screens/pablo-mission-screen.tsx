'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { Pablo } from '@/components/game/characters'
import { DecisionCard, DecisionGroup } from '@/components/game/decision-card'
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, FileText, UserCog, Wallet } from 'lucide-react'
import type { MissionPabloData } from '@/lib/types/game'

interface PabloMissionScreenProps {
  onComplete: (data: MissionPabloData) => void
  onBack: () => void
}

const missionSteps = [
  {
    id: 'accidentType',
    title: "Type d'accident",
    description: "Pablo s'est blesse en cuisinant",
    icon: <AlertTriangle className="w-5 h-5" />,
    options: [
      {
        id: 'travail',
        text: "Accident de travail",
        hrContext: "Vysual declarera l'accident a la CPAM dans les 48h et generera le formulaire officiel."
      },
      {
        id: 'trajet',
        text: "Accident de trajet",
        hrContext: "Vysual gera le regime specifique accident trajet aupres de la Secu avec declarations appropriees."
      },
      {
        id: 'horsPoste',
        text: "Accident hors travail",
        hrContext: "Vysual enregistrera comme arret maladie classique, pas de declaration accident de travail."
      }
    ]
  },
  {
    id: 'accidentDeclaration',
    title: "Qui declare l'accident ?",
    description: "Responsable de la notification officielle",
    icon: <FileText className="w-5 h-5" />,
    options: [
      {
        id: 'moi',
        text: "Moi (gerant)",
        hrContext: "Vous gerez la declaration. Vysual vous aide a rediger le formulaire officiel."
      },
      {
        id: 'fiduciaire',
        text: "Cabinet comptable",
        hrContext: "Votre cabinet declare via Vysual. Suivi partage et archivage centralise."
      },
      {
        id: 'rh',
        text: "Service RH (Vysual)",
        hrContext: "Vysual declare directement aupres de la Secu. Declaration rapide et serieuse."
      }
    ]
  },
  {
    id: 'accidentRemplacement',
    title: "Remplacement de Pablo",
    description: "Pablo est absent 2 semaines",
    icon: <UserCog className="w-5 h-5" />,
    options: [
      {
        id: 'interimaire',
        text: "Agence interim",
        hrContext: "Vysual trace les heures interim, le calcul des couts et genere les declarations URSSAF."
      },
      {
        id: 'heuresSup',
        text: "Heures supplementaires",
        hrContext: "Vysual calcule les heures sup (maj 25-50%), la limite legale (220h/an) et la paie."
      },
      {
        id: 'rien',
        text: "Reduire l'activite",
        hrContext: "Vysual ajuste les plannings et le chiffre d'affaires pour cette periode."
      }
    ]
  },
  {
    id: 'accidentSalaire',
    title: "Salaire pendant l'absence",
    description: "Comment maintenir la paie de Pablo ?",
    icon: <Wallet className="w-5 h-5" />,
    options: [
      {
        id: 'complet',
        text: "Maintien a 100%",
        hrContext: "Vysual calcule le complement aux IJSS Secu et l'ajoute a la paie mensuelle."
      },
      {
        id: 'partiel',
        text: "Maintien 80%",
        hrContext: "Vysual calcule le complement partiel et precise le solde pour Pablo."
      },
      {
        id: 'ijss',
        text: "IJSS uniquement",
        hrContext: "Vysual remplace la paie par les IJSS Secu (a verifier avec convention collective)."
      }
    ]
  }
]

export function PabloMissionScreen({ onComplete, onBack }: PabloMissionScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [decisions, setDecisions] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)

  const step = missionSteps[currentStep]
  const isLastStep = currentStep === missionSteps.length - 1

  const handleSelect = (optionId: string) => {
    setDecisions((prev) => ({
      ...prev,
      [step.id]: optionId
    }))
  }

  const handleNext = () => {
    if (isLastStep) {
      setShowResult(true)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleComplete = () => {
    const data: MissionPabloData = {
      accidentType: decisions.accidentType || '',
      accidentDeclaration: decisions.accidentDeclaration || '',
      accidentRemplacement: decisions.accidentRemplacement || '',
      accidentSalaire: decisions.accidentSalaire || ''
    }
    onComplete(data)
  }

  const selectedOption = step?.options.find((o) => o.id === decisions[step?.id])

  const getVyvyMessage = () => {
    if (showResult) {
      return "Excellent ! Vous avez configure la gestion des accidents. Passons a la derniere situation."
    }
    if (selectedOption) {
      return "Bien note ! Cliquez sur 'Suivant' pour continuer."
    }
    // Guide messages for each step
    const guides: Record<string, string> = {
      'accidentType': "Selectionnez le type d'accident qui s'applique a cette situation.",
      'accidentDeclaration': "Qui s'occupe des declarations officielles dans votre entreprise ?",
      'accidentRemplacement': "Comment gerez-vous l'absence temporaire d'un employe ?",
      'accidentSalaire': "Quelle est votre politique de maintien de salaire ?"
    }
    return guides[step?.id] || "Selectionnez une option ci-dessus."
  }

  const getPabloExpression = () => {
    if (showResult) return 'happy'
    if (currentStep === 0) return 'worried'
    if (selectedOption) return 'neutral'
    return 'worried'
  }

  if (showResult) {
    return (
      <ResultScreen
        decisions={decisions}
        onComplete={handleComplete}
        onBack={() => setShowResult(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm mb-2">
          <AlertTriangle className="w-4 h-4" />
          Situation de crise
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Mission 2 — Accident de travail
        </h2>
        <p className="text-muted-foreground">
          Etape {currentStep + 1} sur {missionSteps.length}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / missionSteps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left side - Pablo and VyvyBot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Pablo with injury indicator */}
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6 flex flex-col items-center relative">
              <div className="absolute top-4 right-4">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </div>
              <Pablo expression={getPabloExpression()} size="lg" />
              <p className="mt-4 text-sm text-muted-foreground text-center italic">
                {currentStep === 0 && '"Aie ! Je me suis coupe en preparant les pizzas..."'}
                {currentStep === 1 && '"Il faut que je voie un medecin, c\'est assez profond."'}
                {currentStep === 2 && '"Je suis desole, je vais devoir m\'absenter..."'}
                {currentStep === 3 && '"Comment ca va se passer pour mon salaire ?"'}
              </p>
            </CardContent>
          </Card>

          {/* VyvyBot */}
          <VyvyBot
            message={getVyvyMessage()}
            expression={selectedOption ? 'happy' : 'thinking'}
            size="sm"
          />
        </motion.div>

        {/* Right side - Decision cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                      {step.icon}
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </div>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <DecisionGroup>
                    {step.options.map((option, index) => (
                      <DecisionCard
                        key={option.id}
                        id={option.id}
                        text={option.text}
                        description={option.description}
                        hrContext={option.hrContext}
                        isSelected={decisions[step.id] === option.id}
                        onClick={() => handleSelect(option.id)}
                        index={index}
                      />
                    ))}
                  </DecisionGroup>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between gap-4 pt-8"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={currentStep > 0 ? () => setCurrentStep((p) => p - 1) : onBack}
          className="flex items-center gap-2 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          {currentStep > 0 ? 'Etape precedente' : 'Retour'}
        </Button>
        <Button 
          size="lg" 
          onClick={handleNext} 
          disabled={!decisions[step.id]}
          className="flex items-center gap-2 font-semibold shadow-lg shadow-primary/20"
        >
          {isLastStep ? 'Voir les resultats' : 'Etape suivante'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
      </motion.div>
    </div>
  )
}

// Result screen component
interface ResultScreenProps {
  decisions: Record<string, string>
  onComplete: () => void
  onBack: () => void
}

function ResultScreen({ decisions, onComplete, onBack }: ResultScreenProps) {
  const summary = [
    { label: "Type d'accident", value: decisions.accidentType === 'travail' ? 'Accident de travail' : decisions.accidentType === 'trajet' ? 'Accident de trajet' : 'Hors poste' },
    { label: "Declaration par", value: decisions.accidentDeclaration === 'moi' ? 'Moi-meme' : decisions.accidentDeclaration === 'fiduciaire' ? 'Fiduciaire' : 'Service RH' },
    { label: "Remplacement", value: decisions.accidentRemplacement === 'interimaire' ? 'Interimaire' : decisions.accidentRemplacement === 'heuresSup' ? 'Heures sup' : 'Reduction activite' },
    { label: "Salaire", value: decisions.accidentSalaire === 'complet' ? 'Maintien 100%' : decisions.accidentSalaire === 'partiel' ? 'Maintien partiel' : 'IJSS uniquement' }
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-amber-600" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Situation geree !
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Vous avez configure la gestion des accidents de travail pour votre pizzeria.
        </p>
      </motion.div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Resume de vos choix</CardTitle>
          <CardDescription>Ces parametres seront utilises par Vysual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4 pt-8"
      >
        <Button 
          variant="outline" 
          size="lg"
          onClick={onBack}
          className="flex items-center gap-2 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Modifier mes choix
        </Button>
        <Button 
          size="lg"
          onClick={onComplete}
          className="flex items-center gap-2 font-semibold shadow-lg shadow-primary/20"
        >
          Mission suivante
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}
