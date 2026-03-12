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
    description: "Selectionnez l'employe a licencier",
    icon: <UserMinus className="w-5 h-5" />,
    type: 'select' as const
  },
  {
    id: 'motif',
    title: "Motif du depart",
    description: "Quelle est la raison ?",
    icon: <FileWarning className="w-5 h-5" />,
    type: 'cards' as const,
    options: [
      {
        id: 'economique',
        text: "Raisons economiques",
        hrContext: "Vysual generera la procedure legale et checklist PSE si necessaire."
      },
      {
        id: 'faute',
        text: "Faute professionnelle",
        hrContext: "Vysual documentera la faute et generera l'entretien prealable officiel."
      },
      {
        id: 'finCDD',
        text: "Fin de CDD",
        hrContext: "Vysual calculera la prime de precarite (10%) et les indemnites CDD."
      },
      {
        id: 'essai',
        text: "Rupture essai",
        hrContext: "Vysual archivera la rupture sans indemnites mais avec respect du delai."
      },
      {
        id: 'commun',
        text: "Rupture conventionnelle",
        hrContext: "Vysual creera l'accord de rupture et validera la transaction."
      }
    ]
  },
  {
    id: 'preavis',
    title: "Duree du preavis",
    description: "Combien de temps ?",
    icon: <Clock className="w-5 h-5" />,
    type: 'cards' as const,
    options: [
      {
        id: 'legal',
        text: "Legal (1-2 mois)",
        hrContext: "Vysual appliquera automatiquement le delai selon l'anciennete."
      },
      {
        id: '1mois',
        text: "1 mois",
        hrContext: "Vysual enregistrera 1 mois exact et calculera la date de fin."
      },
      {
        id: '3mois',
        text: "3 mois",
        hrContext: "Vysual creera le calendrier 3 mois et generera les reminders."
      },
      {
        id: 'rien',
        text: "Pas de preavis",
        hrContext: "Vysual marquera comme depart immediat (exception autorisee)."
      }
    ]
  },
  {
    id: 'solde',
    title: "Solde de tout compte",
    description: "Elements du solde ?",
    icon: <Wallet className="w-5 h-5" />,
    type: 'multiselect' as const,
    options: [
      { id: 'vacances', text: "Conges payes non pris", hrContext: "Vysual calculera l'indemnite CP" },
      { id: 'heuresSup', text: "Heures supplementaires", hrContext: "Vysual listera les heures non recuperees" },
      { id: 'primes', text: "Primes au prorata", hrContext: "Vysual calculera 13e mois et autres primes" },
      { id: 'indemnite', text: "Indemnite legale", hrContext: "Vysual calculera selon anciennete et motif" }
    ]
  },
  {
    id: 'signataire',
    title: "Qui signe ?",
    description: "Signataire des documents",
    icon: <PenTool className="w-5 h-5" />,
    type: 'cards' as const,
    options: [
      {
        id: 'moi',
        text: "Vous (gerant)",
        hrContext: "Vous aurez pouvoir signature. Vysual prepare tous les documents."
      },
      {
        id: 'rh',
        text: "Service RH (Vysual)",
        hrContext: "Vysual signe avec votre delegation. Procedure automatisee."
      },
      {
        id: 'fiduciaire',
        text: "Cabinet comptable",
        hrContext: "Votre cabinet signe. Vysual coordonne et archive tout."
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
      return "Parfait ! Vous avez configure la gestion des fins de contrat. Le recapitulatif va s'afficher."
    }
    if (selectedOption) {
      return "Bien note ! Cliquez sur 'Suivant' pour continuer."
    }
    // Guide messages for each step
    const guides: Record<string, string> = {
      'employeeName': "Selectionnez l'employe concerne par cette procedure.",
      'motif': "Quel est le motif de la fin de contrat ?",
      'preavis': "Quelle duree de preavis souhaitez-vous appliquer ?",
      'solde': "Cochez les elements a inclure dans le solde de tout compte.",
      'signataire': "Qui sera responsable de signer les documents officiels ?"
    }
    return guides[step?.id] || "Selectionnez une option ci-dessus."
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
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs mb-1">
          <UserMinus className="w-3 h-3" />
          Procedure sensible
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          Mission 3 — Gestion des licenciements
        </h2>
        <p className="text-sm text-muted-foreground">
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

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left side - VyvyBot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <VyvyBot
            message={getVyvyMessage()}
            expression={selectedOption ? 'happy' : 'thinking'}
            size="sm"
          />
          
          {/* Info card */}
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-3">
              <h4 className="font-medium text-red-800 mb-1 text-sm">Important</h4>
              <p className="text-xs text-red-700">
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
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {step.icon}
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
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
                          hrContext={option.hrContext}
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
                            {option.hrContext && (
                              <div className="mt-2 p-2 rounded bg-muted/50 flex items-start gap-2">
                                <span className="text-base flex-shrink-0">💡</span>
                                <p className="text-xs text-muted-foreground leading-relaxed">{option.hrContext}</p>
                              </div>
                            )}
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
        className="flex justify-between gap-4 pt-4"
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
          disabled={!canProceed()}
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
          Voir le recapitulatif
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}
