'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { DecisionCard, DecisionGroup } from '@/components/game/decision-card'
import { ArrowLeft, ArrowRight, CheckCircle2, UserMinus, FileWarning, Clock, Wallet, PenTool } from 'lucide-react'
import type { MissionDismissalData, Employee } from '@/lib/types/game'

interface DismissalMissionScreenProps {
  employees: Employee[]
  onComplete: (data: MissionDismissalData) => void
  onBack: () => void
}

const missionSteps = [
  {
    id: 'employeeName',
    title: "Quel employe ?",
    description: "Selectionnez l'employe concerne par cette procedure.",
    helpText: "Chaque employe a des droits specifiques selon son contrat et son anciennete.",
    icon: <UserMinus className="w-5 h-5" />,
    type: 'select' as const
  },
  {
    id: 'motif',
    title: "Motif de la separation",
    description: "Quel est le motif de cette fin de contrat ?",
    helpText: "Le motif determine la procedure a suivre et les indemnites dues.",
    icon: <FileWarning className="w-5 h-5" />,
    type: 'cards' as const,
    options: [
      {
        id: 'economique',
        text: "Motif economique",
        description: "Difficultes financieres, reorganisation, etc.",
        hrLearning: "Le licenciement economique suit une procedure stricte avec PSE si + de 10 salaries."
      },
      {
        id: 'faute',
        text: "Faute professionnelle",
        description: "Manquement aux obligations du contrat",
        hrLearning: "La faute doit etre prouvee. Faute grave = pas de preavis ni d'indemnites."
      },
      {
        id: 'finCDD',
        text: "Fin de CDD",
        description: "Arrivee au terme du contrat",
        hrLearning: "Prime de precarite de 10% sauf faute grave ou refus de CDI."
      },
      {
        id: 'essai',
        text: "Rupture periode d'essai",
        description: "Pendant la periode d'essai",
        hrLearning: "Pas d'indemnites mais respect du delai de prevenance."
      }
    ]
  },
  {
    id: 'preavis',
    title: "Duree du preavis",
    description: "Quelle duree de preavis appliquez-vous ?",
    helpText: "Le preavis depend de l'anciennete et de la convention collective.",
    icon: <Clock className="w-5 h-5" />,
    type: 'cards' as const,
    options: [
      {
        id: 'legal',
        text: "Preavis legal",
        description: "Selon le code du travail (1 a 2 mois)",
        hrLearning: "Le minimum legal : 1 mois si < 2 ans, 2 mois si > 2 ans."
      },
      {
        id: '1mois',
        text: "1 mois",
        description: "Un mois de preavis",
        hrLearning: "Courant pour les employes avec moins de 2 ans d'anciennete."
      },
      {
        id: '3mois',
        text: "3 mois",
        description: "Trois mois de preavis",
        hrLearning: "Souvent applique aux cadres ou profils seniors."
      },
      {
        id: 'contrat',
        text: "Selon le contrat",
        description: "Ce qui est stipule dans le contrat de travail",
        hrLearning: "Le contrat peut prevoir des conditions plus favorables que la loi."
      }
    ]
  },
  {
    id: 'solde',
    title: "Solde de tout compte",
    description: "Quels elements incluez-vous dans le solde ?",
    helpText: "Le solde de tout compte recapitule toutes les sommes dues au salarie.",
    icon: <Wallet className="w-5 h-5" />,
    type: 'multiselect' as const,
    options: [
      { id: 'vacances', text: "Conges payes non pris", description: "Indemnite compensatrice de CP" },
      { id: 'heuresSup', text: "Heures supplementaires", description: "Heures non recuperees" },
      { id: 'primes', text: "Primes au prorata", description: "13eme mois, interessement..." },
      { id: 'indemnite', text: "Indemnite de licenciement", description: "Si applicable" }
    ]
  },
  {
    id: 'signataire',
    title: "Qui signe les documents ?",
    description: "Qui sera signataire des documents officiels ?",
    helpText: "Le signataire engage la responsabilite de l'entreprise.",
    icon: <PenTool className="w-5 h-5" />,
    type: 'cards' as const,
    options: [
      {
        id: 'moi',
        text: "Moi (gerant)",
        description: "Je signe personnellement",
        hrLearning: "En tant que representant legal, vous avez pouvoir de signature."
      },
      {
        id: 'rh',
        text: "Service RH",
        description: "Delegation au service RH",
        hrLearning: "Le RH doit avoir une delegation de pouvoir ecrite."
      },
      {
        id: 'fiduciaire',
        text: "Fiduciaire / Expert",
        description: "Mon cabinet gere la procedure",
        hrLearning: "Utile pour securiser juridiquement la procedure."
      }
    ]
  }
]

export function DismissalMissionScreen({ employees, onComplete, onBack }: DismissalMissionScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [decisions, setDecisions] = useState<Record<string, string | string[]>>({
    solde: ['vacances', 'heuresSup']
  })
  const [showResult, setShowResult] = useState(false)

  const step = missionSteps[currentStep]
  const isLastStep = currentStep === missionSteps.length - 1

  const handleSelect = (value: string) => {
    setDecisions((prev) => ({
      ...prev,
      [step.id]: value
    }))
  }

  const handleMultiSelect = (id: string, checked: boolean) => {
    const current = (decisions.solde as string[]) || []
    if (checked) {
      setDecisions((prev) => ({
        ...prev,
        solde: [...current, id]
      }))
    } else {
      setDecisions((prev) => ({
        ...prev,
        solde: current.filter(item => item !== id)
      }))
    }
  }

  const handleNext = () => {
    if (isLastStep) {
      setShowResult(true)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleComplete = () => {
    const data: MissionDismissalData = {
      employeeName: decisions.employeeName as string || '',
      motif: decisions.motif as string || '',
      preavis: decisions.preavis as string || '',
      solde: decisions.solde as string[] || [],
      signataire: decisions.signataire as string || ''
    }
    onComplete(data)
  }

  const canProceed = () => {
    if (step.type === 'select') {
      return !!decisions.employeeName
    }
    if (step.type === 'multiselect') {
      return (decisions.solde as string[])?.length > 0
    }
    return !!decisions[step.id]
  }

  const selectedOption = step.type === 'cards' 
    ? step.options?.find((o) => o.id === decisions[step.id])
    : null

  const getVyvyMessage = () => {
    if (showResult) {
      return "La procedure de depart est configuree. Ces parametres guideront Vysual pour gerer les fins de contrat."
    }
    if (selectedOption) {
      return selectedOption.hrLearning || ''
    }
    return step.helpText || "Une decision importante qui doit etre bien reflechie..."
  }

  if (showResult) {
    return (
      <ResultScreen
        decisions={decisions}
        employees={employees}
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm mb-2">
          <UserMinus className="w-4 h-4" />
          Procedure sensible
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Mission : Gestion des departs
        </h2>
        <p className="text-muted-foreground">
          Etape {currentStep + 1} sur {missionSteps.length}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-red-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / missionSteps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left side - VyvyBot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <VyvyBot
            message={getVyvyMessage()}
            expression={selectedOption ? 'happy' : 'thinking'}
            size="md"
          />
          
          {/* Info card */}
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <h4 className="font-medium text-red-800 mb-2">Important</h4>
              <p className="text-sm text-red-700">
                Cette mission configure vos procedures de depart. 
                Chaque choix sera utilise par Vysual pour vous accompagner 
                dans ces situations delicates.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right side - Decision interface */}
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
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                      {step.icon}
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </div>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Select type */}
                  {step.type === 'select' && (
                    <Select 
                      value={decisions.employeeName as string || ''} 
                      onValueChange={handleSelect}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selectionnez un employe..." />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.name}>
                            {emp.name} - {emp.role} ({emp.contractType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Cards type */}
                  {step.type === 'cards' && step.options && (
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
                  )}

                  {/* Multiselect type */}
                  {step.type === 'multiselect' && step.options && (
                    <div className="space-y-3">
                      {step.options.map((option) => (
                        <div 
                          key={option.id}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                            (decisions.solde as string[])?.includes(option.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleMultiSelect(
                            option.id, 
                            !(decisions.solde as string[])?.includes(option.id)
                          )}
                        >
                          <Checkbox
                            id={option.id}
                            checked={(decisions.solde as string[])?.includes(option.id)}
                            onCheckedChange={(checked) => handleMultiSelect(option.id, !!checked)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={option.id} className="font-medium cursor-pointer">
                              {option.text}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
        <Button onClick={handleNext} disabled={!canProceed()}>
          {isLastStep ? 'Voir les resultats' : 'Etape suivante'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}

// Result screen component
interface ResultScreenProps {
  decisions: Record<string, string | string[]>
  employees: Employee[]
  onComplete: () => void
  onBack: () => void
}

function ResultScreen({ decisions, employees, onComplete, onBack }: ResultScreenProps) {
  const motifLabels: Record<string, string> = {
    economique: 'Motif economique',
    faute: 'Faute professionnelle',
    finCDD: 'Fin de CDD',
    essai: 'Rupture periode essai'
  }

  const preavisLabels: Record<string, string> = {
    legal: 'Preavis legal',
    '1mois': '1 mois',
    '3mois': '3 mois',
    contrat: 'Selon contrat'
  }

  const soldeLabels: Record<string, string> = {
    vacances: 'Conges payes',
    heuresSup: 'Heures sup',
    primes: 'Primes',
    indemnite: 'Indemnite'
  }

  const signatairLabels: Record<string, string> = {
    moi: 'Gerant',
    rh: 'Service RH',
    fiduciaire: 'Fiduciaire'
  }

  const summary = [
    { label: "Employe", value: decisions.employeeName as string },
    { label: "Motif", value: motifLabels[decisions.motif as string] || decisions.motif },
    { label: "Preavis", value: preavisLabels[decisions.preavis as string] || decisions.preavis },
    { label: "Solde de tout compte", value: (decisions.solde as string[])?.map(s => soldeLabels[s]).join(', ') },
    { label: "Signataire", value: signatairLabels[decisions.signataire as string] || decisions.signataire }
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
          className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-red-600" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Procedure configuree !
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Vous avez defini les parametres de gestion des departs pour votre pizzeria.
        </p>
      </motion.div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Resume de la procedure</CardTitle>
          <CardDescription>Parametres enregistres pour Vysual</CardDescription>
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
                <span className="font-medium text-right max-w-[200px]">{item.value}</span>
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
          Voir le rapport final
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}
