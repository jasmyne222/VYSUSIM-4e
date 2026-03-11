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
    const colors = ['#FF5200', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B']
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
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Felicitations !
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Votre configuration RH est complete. Voici le resume de toutes les informations collectees.
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
            message="Bravo ! Tu as configure toute ta gestion RH en jouant. Vysual est maintenant pret a t'accompagner !"
            expression="excited"
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

          {/* Mission Julie */}
          {session?.missionJulie && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-purple-500" />
                  Conge maternite (Julie)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <DataItem 
                    icon={<Clock className="w-4 h-4" />}
                    label="Duree" 
                    value={formatDuration(session.missionJulie.congeDuree)} 
                  />
                  <DataItem 
                    icon={<Wallet className="w-4 h-4" />}
                    label="Salaire" 
                    value={formatSalary(session.missionJulie.congeSalaire)} 
                  />
                  <DataItem 
                    icon={<Users className="w-4 h-4" />}
                    label="Remplacement" 
                    value={formatReplacement(session.missionJulie.congeRemplacement)} 
                  />
                  <DataItem 
                    icon={<PenTool className="w-4 h-4" />}
                    label="Validation" 
                    value={formatValidation(session.missionJulie.workflowValidation)} 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mission Pablo */}
          {session?.missionPablo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ambulance className="w-5 h-5 text-amber-500" />
                  Accident de travail (Pablo)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <DataItem 
                    icon={<AlertTriangle className="w-4 h-4" />}
                    label="Type" 
                    value={formatAccidentType(session.missionPablo.accidentType)} 
                  />
                  <DataItem 
                    icon={<FileText className="w-4 h-4" />}
                    label="Declaration" 
                    value={formatDeclaration(session.missionPablo.accidentDeclaration)} 
                  />
                  <DataItem 
                    icon={<Users className="w-4 h-4" />}
                    label="Remplacement" 
                    value={formatAccidentReplacement(session.missionPablo.accidentRemplacement)} 
                  />
                  <DataItem 
                    icon={<Wallet className="w-4 h-4" />}
                    label="Salaire" 
                    value={formatAccidentSalary(session.missionPablo.accidentSalaire)} 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mission Dismissal */}
          {session?.missionDismissal && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserMinus className="w-5 h-5 text-red-500" />
                  Gestion des departs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <DataItem 
                    icon={<Users className="w-4 h-4" />}
                    label="Employe" 
                    value={session.missionDismissal.employeeName} 
                  />
                  <DataItem 
                    icon={<FileText className="w-4 h-4" />}
                    label="Motif" 
                    value={formatMotif(session.missionDismissal.motif)} 
                  />
                  <DataItem 
                    icon={<Clock className="w-4 h-4" />}
                    label="Preavis" 
                    value={formatPreavis(session.missionDismissal.preavis)} 
                  />
                  <DataItem 
                    icon={<Wallet className="w-4 h-4" />}
                    label="Solde" 
                    value={session.missionDismissal.solde.join(', ')} 
                  />
                  <DataItem 
                    icon={<PenTool className="w-4 h-4" />}
                    label="Signataire" 
                    value={formatSignataire(session.missionDismissal.signataire)} 
                  />
                </div>
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

// Helper components
function DataItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <div className="text-primary mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
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
    'essai': 'Rupture periode essai'
  }
  return map[value] || value
}

function formatPreavis(value: string): string {
  const map: Record<string, string> = {
    'legal': 'Preavis legal',
    '1mois': '1 mois',
    '3mois': '3 mois',
    'contrat': 'Selon contrat'
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
