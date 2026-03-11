'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { Julie } from '@/components/game/characters'
import { DecisionCard, DecisionGroup } from '@/components/game/decision-card'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, MessageCircle } from 'lucide-react'

interface JulieMissionScreenProps {
  onComplete: (decisions: Record<string, string>) => void
  onBack: () => void
}

const missionSteps = [
  {
    id: 'approach',
    title: "Comment aborder Julie ?",
    description: "Julie semble stressée. Comment allez-vous l'aborder ?",
    icon: <MessageCircle className="w-5 h-5" />,
    options: [
      {
        id: 'private',
        text: "L'inviter dans le bureau pour discuter en privé",
        consequence: "Bonne approche ! Un cadre privé permet une discussion ouverte.",
        hrLearning: "Toujours privilégier un espace confidentiel pour les discussions sensibles."
      },
      {
        id: 'public',
        text: "Lui parler directement dans la salle",
        consequence: "Attention, cela peut la mettre mal à l'aise devant les collègues.",
        hrLearning: "Évitez les discussions RH en public."
      },
      {
        id: 'delegate',
        text: "Demander à Carlos de lui parler",
        consequence: "Carlos peut aider, mais en tant que RH, c'est votre responsabilité.",
        hrLearning: "Le manager peut être impliqué, mais le RH doit rester le référent."
      }
    ]
  },
  {
    id: 'problem',
    title: "Comprendre le problème",
    description: "Julie explique qu'elle a du mal à pointer correctement ses heures. Que faites-vous ?",
    icon: <Clock className="w-5 h-5" />,
    options: [
      {
        id: 'listen',
        text: "Écouter attentivement et poser des questions ouvertes",
        consequence: "Parfait ! Vous découvrez qu'elle ne comprend pas le système de pointage.",
        hrLearning: "L'écoute active permet d'identifier la vraie cause du problème."
      },
      {
        id: 'explain',
        text: "Lui réexpliquer immédiatement les règles",
        consequence: "Vous passez à côté du vrai problème - elle avait besoin d'être écoutée d'abord.",
        hrLearning: "Comprendre avant d'agir : écoutez d'abord, expliquez ensuite."
      },
      {
        id: 'report',
        text: "Lui demander de faire un rapport écrit",
        consequence: "Trop formel pour un premier échange, cela crée de la distance.",
        hrLearning: "Adaptez le formalisme au contexte et à la personne."
      }
    ]
  },
  {
    id: 'solution',
    title: "Proposer une solution",
    description: "Julie a besoin d'un accompagnement. Quelle solution proposez-vous ?",
    icon: <FileText className="w-5 h-5" />,
    options: [
      {
        id: 'training',
        text: "Organiser une formation au système de pointage avec Maria comme tutrice",
        consequence: "Excellente idée ! Le mentorat par un collègue expérimenté facilite l'intégration.",
        hrLearning: "Le parrainage est un outil puissant d'intégration et de formation."
      },
      {
        id: 'documentation',
        text: "Lui donner le manuel du système de pointage",
        consequence: "C'est un bon complément, mais insuffisant seul pour une nouvelle recrue.",
        hrLearning: "La documentation écrite doit accompagner, pas remplacer, la formation."
      },
      {
        id: 'flexibility',
        text: "Lui proposer de pointer manuellement en attendant",
        consequence: "Solution temporaire acceptable, mais ne résout pas le problème de fond.",
        hrLearning: "Les solutions temporaires doivent mener à des solutions durables."
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
    onComplete(decisions)
  }

  const selectedOption = step?.options.find((o) => o.id === decisions[step?.id])

  const getVyvyMessage = () => {
    if (showResult) {
      return "Bravo ! Tu as gere cette situation avec Julie. Voyons ce que tu as appris..."
    }
    if (selectedOption) {
      return selectedOption.hrLearning
    }
    return step?.description || "Reflechis bien avant de choisir..."
  }

  const getJulieExpression = () => {
    if (showResult) return 'happy'
    if (currentStep === 0) return 'worried'
    if (currentStep === 1 && selectedOption?.id === 'listen') return 'neutral'
    if (currentStep === 2) return 'excited'
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
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Mission : Julie
        </h2>
        <p className="text-muted-foreground">
          Etape {currentStep + 1} sur {missionSteps.length}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
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
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Julie expression={getJulieExpression()} size="lg" />
              <p className="mt-4 text-sm text-muted-foreground text-center italic">
                {currentStep === 0 && '"Je... je ne sais pas si je fais bien les choses..."'}
                {currentStep === 1 && '"Le systeme de pointage, je ne comprends pas comment ca marche."'}
                {currentStep === 2 && '"Merci de m\'ecouter, ca me rassure."'}
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
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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
                        isSelected={decisions[step.id] === option.id}
                        consequence={option.consequence}
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
  const learnings = missionSteps.map((step) => {
    const selected = step.options.find((o) => o.id === decisions[step.id])
    return {
      step: step.title,
      choice: selected?.text || '',
      learning: selected?.hrLearning || ''
    }
  })

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
          className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Mission accomplie !
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Vous avez aide Julie a s'integrer dans l'equipe. Voici ce que vous avez appris.
        </p>
      </motion.div>

      <div className="grid gap-4 max-w-2xl mx-auto">
        {learnings.map((learning, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{learning.step}</CardTitle>
                <CardDescription className="text-sm">{learning.choice}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">*</span>
                    {learning.learning}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-4 pt-6"
      >
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Revoir mes choix
        </Button>
        <Button onClick={onComplete}>
          Terminer
          <CheckCircle2 className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}
