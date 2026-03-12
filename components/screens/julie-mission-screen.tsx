'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { Julie } from '@/components/game/characters'
import { DecisionCard, DecisionGroup } from '@/components/game/decision-card'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Wallet, Users, PenTool, Baby } from 'lucide-react'
import type { MissionJulieData } from '@/lib/types/game'

interface JulieMissionScreenProps {
  onComplete: (data: MissionJulieData) => void
  onBack: () => void
}

const missionSteps = [
  {
    id: 'congeDuree',
    title: "Duree du conge maternite",
    description: "Julie annonce sa grossesse",
    icon: <Clock className="w-5 h-5" />,
    options: [
      {
        id: 'legal',
        text: "16 semaines (minimum legal)",
        hrContext: "Vysual utilisera cette duree pour configurer l'absence, calculer la paie et planifier le remplacement."
      },
      {
        id: '20',
        text: "20 semaines",
        hrContext: "Vysual utilisera cette duree pour configurer l'absence, calculer la paie et planifier le remplacement."
      },
      {
        id: '24',
        text: "24 semaines",
        hrContext: "Vysual utilisera cette duree pour configurer l'absence, calculer la paie et planifier le remplacement."
      }
    ]
  },
  {
    id: 'congeSalaire',
    title: "Salaire pendant le conge",
    description: "Quel est le maintien de salaire ?",
    icon: <Wallet className="w-5 h-5" />,
    options: [
      {
        id: 'complet',
        text: "Maintien a 100%",
        hrContext: "Vysual calculera le complement aux IJSS Secu et l'ajoutera a la paie mensuelle."
      },
      {
        id: 'partiel',
        text: "Maintien partiel (80%)",
        hrContext: "Vysual calculera le complement partiel aux IJSS et precisera le solde pour Julie."
      },
      {
        id: 'ijss',
        text: "IJSS uniquement",
        hrContext: "Vysual declarera l'absence et remplacera le salaire par les IJSS Secu (a verifier)."
      }
    ]
  },
  {
    id: 'congeRemplacement',
    title: "Remplacement durant l'absence",
    description: "Comment remplacer Julie ?",
    icon: <Users className="w-5 h-5" />,
    options: [
      {
        id: 'interne',
        text: "Promotion interne temporaire",
        hrContext: "Vysual enregistrera la promotion temporaire et assurera le retour au poste normal."
      },
      {
        id: 'cdd',
        text: "CDD de remplacement",
        hrContext: "Vysual generera le contrat CDD jusqu'au retour de Julie et gerera les fins de contrat."
      },
      {
        id: 'interim',
        text: "Agence interim",
        hrContext: "Vysual tracera les frais interim, les declarations et le suivi des rapports."
      }
    ]
  },
  {
    id: 'workflowValidation',
    title: "Qui valide les absences ?",
    description: "Qui approuve le conge maternite ?",
    icon: <PenTool className="w-5 h-5" />,
    options: [
      {
        id: 'moi',
        text: "Moi (gerant)",
        hrContext: "Vous validez directement dans Vysual. Responsabilite complete, mais full control."
      },
      {
        id: 'rh',
        text: "Service RH (Vysual)",
        hrContext: "Vysual valide et enregistre. Gain de temps, expertise RH integree."
      },
      {
        id: 'fiduciaire',
        text: "Cabinet comptable",
        hrContext: "Vous autorisez votre cabinet a valider via Vysual. Coordination externe."
      }
    ]
  }
]

export function JulieMissionScreen({ onComplete, onBack }: JulieMissionScreenProps) {
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
    const data: MissionJulieData = {
      congeDuree: decisions.congeDuree || '',
      congeSalaire: decisions.congeSalaire || '',
      congeRemplacement: decisions.congeRemplacement || '',
      workflowValidation: decisions.workflowValidation || ''
    }
    onComplete(data)
  }

  const selectedOption = step?.options.find((o) => o.id === decisions[step?.id])

  const getVyvyMessage = () => {
    if (showResult) {
      return "Parfait ! Vous avez configure la gestion des conges maternite. Passons a la situation suivante."
    }
    if (selectedOption) {
      return "Bon choix ! Cliquez sur 'Suivant' pour continuer."
    }
    // Guide messages for each step
    const guides: Record<string, string> = {
      'congeDuree': "Cliquez sur l'option qui correspond a votre politique d'entreprise.",
      'congeSalaire': "Choisissez comment vous gerez le salaire pendant le conge.",
      'congeRemplacement': "Comment souhaitez-vous remplacer l'employee absente ?",
      'workflowValidation': "Qui sera responsable de valider les demandes de conge ?"
    }
    return guides[step?.id] || "Selectionnez une option ci-dessus."
  }

  const getJulieExpression = () => {
    if (showResult) return 'happy'
    if (currentStep === 0) return 'worried'
    if (selectedOption) return 'excited'
    return 'neutral'
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm mb-2">
          <Baby className="w-4 h-4" />
          Bonne nouvelle !
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Mission 1 — Conge maternite
        </h2>
        <p className="text-muted-foreground">
          Etape {currentStep + 1} sur {missionSteps.length}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / missionSteps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left side - Julie and VyvyBot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Julie */}
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="pt-6 flex flex-col items-center">
              <Julie expression={getJulieExpression()} size="lg" />
              <p className="mt-4 text-sm text-muted-foreground text-center italic">
                {currentStep === 0 && '"J\'ai une grande nouvelle... Je suis enceinte !"'}
                {currentStep === 1 && '"Comment ca va se passer pour mon salaire ?"'}
                {currentStep === 2 && '"Qui va me remplacer pendant mon absence ?"'}
                {currentStep === 3 && '"A qui dois-je faire mes demandes ?"'}
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
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
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
    { 
      label: "Duree du conge", 
      value: decisions.congeDuree === 'legal' ? '16 semaines (legal)' : 
             decisions.congeDuree === '20' ? '20 semaines' : '24 semaines'
    },
    { 
      label: "Maintien salaire", 
      value: decisions.congeSalaire === 'complet' ? 'Maintien 100%' : 
             decisions.congeSalaire === 'partiel' ? 'Maintien 80%' : 'IJSS uniquement'
    },
    { 
      label: "Remplacement", 
      value: decisions.congeRemplacement === 'interne' ? 'Promotion interne' : 
             decisions.congeRemplacement === 'cdd' ? 'CDD remplacement' : 'Interim'
    },
    { 
      label: "Validation par", 
      value: decisions.workflowValidation === 'moi' ? 'Gerant' : 
             decisions.workflowValidation === 'rh' ? 'Service RH' : 'Fiduciaire'
    }
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
          className="w-20 h-20 mx-auto rounded-full bg-purple-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-purple-600" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Configuration terminee !
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Le conge maternite de Julie est maintenant configure selon vos preferences.
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
