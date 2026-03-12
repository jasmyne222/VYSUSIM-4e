'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { 
  CheckCircle2, Download, Send, Users, AlertTriangle, 
  Baby, Ambulance, UserMinus, FileText, Sparkles,
  Building, Clock, Wallet, PenTool
} from 'lucide-react'
import type { GameSession } from '@/lib/types/game'

interface ReportScreenProps {
  session: GameSession | null
  onRestart: () => void
}

// Confetti component
function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    color: string
    delay: number
  }>>([])

  useEffect(() => {
    // Vysual corporate colors - orange primary with subtle accents
    const colors = ['#FF5200', '#FF7A3D', '#FFE5D9', '#4A5568', '#E2E8F0']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{ 
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            top: -20
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ 
            y: window.innerHeight + 50, 
            rotate: 360 * 3,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: particle.delay,
            ease: 'easeIn'
          }}
        />
      ))}
    </div>
  )
}

export function ReportScreen({ session, onRestart }: ReportScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleDownloadPDF = () => {
    // Generate PDF content
    const content = generateReportContent(session)
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vysual-hr-rapport-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSendToVysual = () => {
    // Simulate sending to Vysual
    alert('Rapport envoye a Vysual ! Vous recevrez une confirmation par email.')
  }

  const completionRate = calculateCompletionRate(session)
  const warnings = getWarnings(session)

  return (
    <div className="space-y-8 pb-12">
      {showConfetti && <Confetti />}

      {/* Header with celebration */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
          className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Simulation terminee
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Voici le recapitulatif de vos besoins RH. Ces informations permettront a Vysual de configurer votre solution sur-mesure.
        </p>
      </motion.div>

      {/* Completion stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{session?.teamConfig.length || 0}</div>
            <p className="text-sm text-muted-foreground">Employes</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">3</div>
            <p className="text-sm text-muted-foreground">Missions</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{completionRate}%</div>
            <p className="text-sm text-muted-foreground">Complete</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-500">{warnings.length}</div>
            <p className="text-sm text-muted-foreground">Alertes</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* VyvyBot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VyvyBot
            message="Bravo ! Vous avez complete la simulation. Ces informations vont permettre a Vysual de creer votre solution RH sur-mesure."
            expression="happy"
            size="md"
          />
        </motion.div>

        {/* Report sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Warnings */}
          {warnings.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                  Points d'attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {warnings.map((warning, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-amber-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Team section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Equipe ({session?.teamConfig.length || 0} employes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {session?.teamConfig.map((emp, i) => (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: emp.avatarConfig.color || '#FF5200' }}
                    >
                      {emp.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.role} - {emp.contractType}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mission Julie - Formal questionnaire format */}
          {session?.missionJulie && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-primary" />
                  Gestion des conges maternite
                </CardTitle>
                <CardDescription>Vos preferences pour la gestion des absences maternite</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuestionItem 
                  question="Quelle duree de conge maternite souhaitez-vous accorder ?"
                  answer={formatDuration(session.missionJulie.congeDuree)} 
                />
                <QuestionItem 
                  question="Quel maintien de salaire pendant le conge ?"
                  answer={formatSalary(session.missionJulie.congeSalaire)} 
                />
                <QuestionItem 
                  question="Comment souhaitez-vous gerer le remplacement ?"
                  answer={formatReplacement(session.missionJulie.congeRemplacement)} 
                />
                <QuestionItem 
                  question="Qui valide les demandes de conge maternite ?"
                  answer={formatValidation(session.missionJulie.workflowValidation)} 
                />
              </CardContent>
            </Card>
          )}

          {/* Mission Pablo - Formal questionnaire format */}
          {session?.missionPablo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ambulance className="w-5 h-5 text-primary" />
                  Gestion des accidents de travail
                </CardTitle>
                <CardDescription>Vos preferences pour la gestion des accidents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuestionItem 
                  question="Comment classifiez-vous les accidents ?"
                  answer={formatAccidentType(session.missionPablo.accidentType)} 
                />
                <QuestionItem 
                  question="Qui effectue les declarations d'accident ?"
                  answer={formatDeclaration(session.missionPablo.accidentDeclaration)} 
                />
                <QuestionItem 
                  question="Comment gerez-vous le remplacement temporaire ?"
                  answer={formatAccidentReplacement(session.missionPablo.accidentRemplacement)} 
                />
                <QuestionItem 
                  question="Quel maintien de salaire pendant l'arret ?"
                  answer={formatAccidentSalary(session.missionPablo.accidentSalaire)} 
                />
              </CardContent>
            </Card>
          )}

          {/* Mission Dismissal - Formal questionnaire format */}
          {session?.missionDismissal && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserMinus className="w-5 h-5 text-primary" />
                  Gestion des fins de contrat
                </CardTitle>
                <CardDescription>Vos preferences pour la gestion des departs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuestionItem 
                  question="Quels types de motifs de depart gerez-vous ?"
                  answer={formatMotif(session.missionDismissal.motif)} 
                />
                <QuestionItem 
                  question="Quelle duree de preavis appliquez-vous ?"
                  answer={formatPreavis(session.missionDismissal.preavis)} 
                />
                <QuestionItem 
                  question="Quels elements incluez-vous dans le solde de tout compte ?"
                  answer={formatSolde(session.missionDismissal.solde)} 
                />
                <QuestionItem 
                  question="Qui signe les documents de depart ?"
                  answer={formatSignataire(session.missionDismissal.signataire)} 
                />
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row justify-center gap-4 pt-8"
      >
        <Button 
          size="lg" 
          onClick={handleSendToVysual}
          className="gap-2"
        >
          <Send className="w-5 h-5" />
          Envoyer a Vysual
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          onClick={handleDownloadPDF}
          className="gap-2"
        >
          <Download className="w-5 h-5" />
          Telecharger PDF
        </Button>
      </motion.div>

      {/* Restart option */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Button variant="link" onClick={onRestart} className="text-muted-foreground">
          Recommencer une nouvelle configuration
        </Button>
      </motion.div>
    </div>
  )
}

// Helper components - Formal questionnaire style
function QuestionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
      <p className="text-sm text-muted-foreground mb-1">{question}</p>
      <p className="font-medium text-foreground flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
        {answer}
      </p>
    </div>
  )
}

// Helper functions
function calculateCompletionRate(session: GameSession | null): number {
  if (!session) return 0
  let completed = 0
  let total = 4 // team + 3 missions
  
  if (session.teamConfig.length > 0) completed++
  if (session.missionJulie) completed++
  if (session.missionPablo) completed++
  if (session.missionDismissal) completed++
  
  return Math.round((completed / total) * 100)
}

function getWarnings(session: GameSession | null): string[] {
  const warnings: string[] = []
  if (!session) return warnings
  
  if (session.teamConfig.length === 0) {
    warnings.push("Aucun employe configure")
  }
  if (!session.missionJulie) {
    warnings.push("Configuration conge maternite incomplete")
  }
  if (!session.missionPablo) {
    warnings.push("Configuration accident de travail incomplete")
  }
  if (!session.missionDismissal) {
    warnings.push("Configuration departs incomplete")
  }
  
  return warnings
}

function generateReportContent(session: GameSession | null): string {
  if (!session) return ''
  
  let content = `RAPPORT VYSUAL HR - ${new Date().toLocaleDateString('fr-FR')}\n`
  content += '='.repeat(50) + '\n\n'
  
  content += `EQUIPE (${session.teamConfig.length} employes)\n`
  content += '-'.repeat(30) + '\n'
  session.teamConfig.forEach(emp => {
    content += `- ${emp.name}: ${emp.role} (${emp.contractType})\n`
  })
  content += '\n'
  
  if (session.missionJulie) {
    content += 'CONGE MATERNITE\n'
    content += '-'.repeat(30) + '\n'
    content += `Duree: ${session.missionJulie.congeDuree}\n`
    content += `Salaire: ${session.missionJulie.congeSalaire}\n`
    content += `Remplacement: ${session.missionJulie.congeRemplacement}\n`
    content += `Validation: ${session.missionJulie.workflowValidation}\n\n`
  }
  
  if (session.missionPablo) {
    content += 'ACCIDENT DE TRAVAIL\n'
    content += '-'.repeat(30) + '\n'
    content += `Type: ${session.missionPablo.accidentType}\n`
    content += `Declaration: ${session.missionPablo.accidentDeclaration}\n`
    content += `Remplacement: ${session.missionPablo.accidentRemplacement}\n`
    content += `Salaire: ${session.missionPablo.accidentSalaire}\n\n`
  }
  
  if (session.missionDismissal) {
    content += 'GESTION DES DEPARTS\n'
    content += '-'.repeat(30) + '\n'
    content += `Motif: ${session.missionDismissal.motif}\n`
    content += `Preavis: ${session.missionDismissal.preavis}\n`
    content += `Solde: ${session.missionDismissal.solde.join(', ')}\n`
    content += `Signataire: ${session.missionDismissal.signataire}\n`
  }
  
  return content
}

// Format helpers
function formatDuration(value: string): string {
  const map: Record<string, string> = {
    'legal': '16 semaines (legal)',
    '20': '20 semaines',
    '24': '24 semaines'
  }
  return map[value] || value
}

function formatSalary(value: string): string {
  const map: Record<string, string> = {
    'complet': 'Maintien 100%',
    'partiel': 'Maintien partiel',
    'ijss': 'IJSS uniquement'
  }
  return map[value] || value
}

function formatReplacement(value: string): string {
  const map: Record<string, string> = {
    'interne': 'Recrutement interne',
    'cdd': 'CDD remplacement',
    'interim': 'Interimaire'
  }
  return map[value] || value
}

function formatValidation(value: string): string {
  const map: Record<string, string> = {
    'moi': 'Gerant',
    'rh': 'Service RH',
    'fiduciaire': 'Fiduciaire'
  }
  return map[value] || value
}

function formatAccidentType(value: string): string {
  const map: Record<string, string> = {
    'travail': 'Accident de travail',
    'trajet': 'Accident de trajet',
    'horsPoste': 'Hors poste'
  }
  return map[value] || value
}

function formatDeclaration(value: string): string {
  const map: Record<string, string> = {
    'moi': 'Par le gerant',
    'fiduciaire': 'Par la fiduciaire',
    'rh': 'Par le service RH'
  }
  return map[value] || value
}

function formatAccidentReplacement(value: string): string {
  const map: Record<string, string> = {
    'interimaire': 'Interimaire',
    'heuresSup': 'Heures supplementaires',
    'rien': 'Reduction activite'
  }
  return map[value] || value
}

function formatAccidentSalary(value: string): string {
  const map: Record<string, string> = {
    'complet': 'Maintien 100%',
    'partiel': 'Maintien partiel',
    'ijss': 'IJSS uniquement'
  }
  return map[value] || value
}

function formatMotif(value: string): string {
  const map: Record<string, string> = {
    'economique': 'Motif economique',
    'faute': 'Faute professionnelle',
    'finCDD': 'Fin de CDD',
    'essai': 'Rupture periode essai',
    'commun': 'Rupture conventionnelle'
  }
  return map[value] || value
}

function formatSolde(values: string[]): string {
  const map: Record<string, string> = {
    'vacances': 'Conges payes',
    'heuresSup': 'Heures supplementaires',
    'primes': 'Primes au prorata',
    'indemnite': 'Indemnite legale'
  }
  return values.map(v => map[v] || v).join(', ') || 'Non specifie'
}

function formatPreavis(value: string): string {
  const map: Record<string, string> = {
    'legal': 'Preavis legal (1-2 mois)',
    '1mois': '1 mois',
    '3mois': '3 mois',
    'rien': 'Depart immediat (pas de preavis)'
  }
  return map[value] || value
}

function formatSignataire(value: string): string {
  const map: Record<string, string> = {
    'moi': 'Gerant',
    'rh': 'Service RH',
    'fiduciaire': 'Fiduciaire'
  }
  return map[value] || value
}
