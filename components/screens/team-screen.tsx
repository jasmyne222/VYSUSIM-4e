'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { Maria, Pablo, Julie, Carlos } from '@/components/game/characters'
import { ArrowRight, ArrowLeft, Briefcase, Clock, Calendar } from 'lucide-react'
import type { Employee } from '@/lib/types/game'

interface TeamScreenProps {
  onNext: (employees: Employee[]) => void
  onBack: () => void
}

const defaultEmployees: Employee[] = [
  {
    id: '1',
    name: 'Maria',
    role: 'Chef de cuisine',
    contractType: 'CDI',
    age: 42,
    startDate: '2019-03-15',
    timekeepingMethod: 'badge',
    avatarConfig: { color: '#D64933' }
  },
  {
    id: '2',
    name: 'Pablo',
    role: 'Serveur',
    contractType: 'CDI',
    age: 28,
    startDate: '2021-09-01',
    timekeepingMethod: 'app',
    avatarConfig: { color: '#2D3436' }
  },
  {
    id: '3',
    name: 'Julie',
    role: 'Nouvelle serveuse',
    contractType: 'CDD',
    age: 23,
    startDate: '2024-01-08',
    timekeepingMethod: 'manual',
    avatarConfig: { color: '#6C5CE7' }
  },
  {
    id: '4',
    name: 'Carlos',
    role: 'Manager',
    contractType: 'CDI',
    age: 35,
    startDate: '2018-06-01',
    timekeepingMethod: 'badge',
    avatarConfig: { color: '#00B894' }
  }
]

export function TeamScreen({ onNext, onBack }: TeamScreenProps) {
  const [employees] = useState<Employee[]>(defaultEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [vyvyMessage, setVyvyMessage] = useState(
    "Voici ton equipe ! Clique sur un membre pour en savoir plus sur son contrat et son poste."
  )

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee.id)
    setVyvyMessage(
      `${employee.name} est ${employee.role}. ${
        employee.contractType === 'CDD'
          ? "C'est un CDD, attention aux regles specifiques !"
          : "En CDI, un pilier de l'equipe !"
      }`
    )
  }

  const selectedEmployeeData = employees.find((e) => e.id === selectedEmployee)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Votre equipe
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Decouvrez les membres de votre equipe et leurs situations contractuelles
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* VyvyBot sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24">
            <VyvyBot message={vyvyMessage} expression="happy" size="md" />
          </div>
        </motion.div>

        {/* Team grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Character selection */}
          <Card>
            <CardHeader>
              <CardTitle>Les membres de l'equipe</CardTitle>
              <CardDescription>
                Cliquez sur un personnage pour voir ses details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-6 py-4">
                <div onClick={() => handleEmployeeClick(employees[0])}>
                  <Maria
                    expression={selectedEmployee === '1' ? 'excited' : 'neutral'}
                    isHighlighted={selectedEmployee === '1'}
                    size="md"
                  />
                </div>
                <div onClick={() => handleEmployeeClick(employees[1])}>
                  <Pablo
                    expression={selectedEmployee === '2' ? 'excited' : 'neutral'}
                    isHighlighted={selectedEmployee === '2'}
                    size="md"
                  />
                </div>
                <div onClick={() => handleEmployeeClick(employees[2])}>
                  <Julie
                    expression={selectedEmployee === '3' ? 'excited' : 'neutral'}
                    isHighlighted={selectedEmployee === '3'}
                    size="md"
                  />
                </div>
                <div onClick={() => handleEmployeeClick(employees[3])}>
                  <Carlos
                    expression={selectedEmployee === '4' ? 'excited' : 'neutral'}
                    isHighlighted={selectedEmployee === '4'}
                    size="md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee details */}
          {selectedEmployeeData && (
            <motion.div
              key={selectedEmployeeData.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedEmployeeData.avatarConfig.color }}
                    />
                    {selectedEmployeeData.name}
                  </CardTitle>
                  <CardDescription>{selectedEmployeeData.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contrat</p>
                        <p className="font-medium">{selectedEmployeeData.contractType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Depuis</p>
                        <p className="font-medium">
                          {new Date(selectedEmployeeData.startDate).toLocaleDateString('fr-FR', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Pointage</p>
                        <p className="font-medium capitalize">{selectedEmployeeData.timekeepingMethod}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
        <Button onClick={() => onNext(employees)}>
          Continuer
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}
