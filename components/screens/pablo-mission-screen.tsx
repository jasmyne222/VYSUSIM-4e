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
    description: "Pablo s'est blesse en cuisinant. Comment classez-vous cet accident ?",
    helpText: "Le type d'accident determine les obligations legales et la prise en charge.",
    icon: <AlertTriangle className="w-5 h-5" />,
    options: [
      {
        id: 'travail',
        text: "Accident de travail",
        icon: "briefcase",
        description: "Survenu pendant l'exercice de ses fonctions au restaurant",
        hrLearning: "Un accident de travail doit etre declare dans les 48h a la CPAM."
      },
      {
        id: 'trajet',
        text: "Accident de trajet",
        icon: "car",
        description: "Survenu sur le trajet domicile-travail",
        hrLearning: "L'accident de trajet a un regime specifique, different de l'accident de travail."
      },
      {
        id: 'horsPoste',
        text: "Accident hors poste",
        icon: "home",
        description: "Survenu en dehors du temps de travail",
        hrLearning: "Hors temps de travail = arret maladie classique, pas d'accident de travail."
      }
    ]
  },
  {
    id: 'accidentDeclaration',
    title: "Qui fait la declaration ?",
    description: "L'accident doit etre declare officiellement. Qui s'en charge ?",
    helpText: "La declaration est obligatoire et engage la responsabilite de l'employeur.",
    icon: <FileText className="w-5 h-5" />,
    options: [
      {
        id: 'moi',
        text: "Je m'en charge personnellement",
        icon: "user",
        description: "En tant que gerant, je fais la declaration moi-meme",
        hrLearning: "L'employeur est responsable de la declaration dans les 48h."
      },
      {
        id: 'fiduciaire',
        text: "Ma fiduciaire / comptable",
        icon: "building",
        description: "Je delegue a mon cabinet comptable",
        hrLearning: "Deleguer est possible mais l'employeur reste responsable du delai."
      },
      {
        id: 'rh',
        text: "Service RH externe (Vysual)",
        icon: "users",
        description: "Vysual gere la declaration pour moi",
        hrLearning: "Un service RH peut gerer, mais doit avoir les informations rapidement."
      }
    ]
  },
  {
    id: 'accidentRemplacement',
    title: "Remplacement de Pablo",
    description: "Pablo sera absent 2 semaines. Comment gerez-vous son absence ?",
    helpText: "Le choix impacte la continuite du service et les couts.",
    icon: <UserCog className="w-5 h-5" />,
    options: [
      {
        id: 'interimaire',
        text: "Recruter un interimaire",
        icon: "user-plus",
        description: "Faire appel a une agence d'interim",
        hrLearning: "L'interim permet une flexibilite mais a un cout plus eleve."
      },
      {
        id: 'heuresSup',
        text: "Heures supplementaires equipe",
        icon: "clock",
        description: "Repartir le travail sur l'equipe existante",
        hrLearning: "Les heures sup sont reglementees : max 220h/an, majorees de 25% a 50%."
      },
      {
        id: 'rien',
        text: "Reduire l'activite",
        icon: "minus-circle",
        description: "Adapter le service le temps de l'absence",
        hrLearning: "Solution economique mais peut impacter la qualite de service."
      }
    ]
  },
  {
    id: 'accidentSalaire',
    title: "Maintien de salaire",
    description: "Pendant l'arret de Pablo, comment gerez-vous son salaire ?",
    helpText: "Le maintien de salaire depend de la convention collective et de l'anciennete.",
    icon: <Wallet className="w-5 h-5" />,
    options: [
      {
        id: 'complet',
        text: "Maintien a 100%",
        icon: "check-circle",
        description: "Je complete les indemnites CPAM pour atteindre 100%",
        hrLearning: "Genereux mais pas obligatoire, cela fidelise les employes."
      },
      {
        id: 'partiel',
        text: "Maintien partiel",
        icon: "percent",
        description: "Je complete partiellement (ex: 80%)",
        hrLearning: "Un compromis entre fidelisation et gestion des couts."
      },
      {
        id: 'ijss',
        text: "IJSS uniquement",
        icon: "file-text",
        description: "Pablo ne recoit que les indemnites de la Secu",
        hrLearning: "Legal mais peut etre mal percu par l'employe."
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
      return "Excellent ! Tu as bien gere l'accident de Pablo. Ces choix seront enregistres dans ta configuration RH."
    }
    if (selectedOption) {
      return selectedOption.hrLearning
    }
    return step?.helpText || "Reflechis bien, c'est une situation delicate..."
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
          Mission : Accident de Pablo
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
        className="flex justify-between pt-6"
      >
        <Button
          variant="outline"
          onClick={currentStep > 0 ? () => setCurrentStep((p) => p - 1) : onBack}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          {currentStep > 0 ? 'Etape precedente' : 'Retour'}
        </Button>
        <Button onClick={handleNext} disabled={!decisions[step.id]}>
          {isLastStep ? 'Voir les resultats' : 'Etape suivante'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
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
        className="flex justify-center gap-4 pt-6"
      >
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Modifier mes choix
        </Button>
        <Button onClick={onComplete}>
          Mission suivante
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}
