'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { VyvyBot } from '@/components/game/vyvy-bot'
import { Maria, Pablo, Julie, Carlos } from '@/components/game/characters'
import { 
  ArrowRight, ArrowLeft, Briefcase, Clock, Calendar, 
  Plus, Edit2, Trash2, Users, GitBranch, Car, X, Check,
  Info
} from 'lucide-react'
import type { Employee, RoleType, ContractType, TimekeepingMethod } from '@/lib/types/game'

interface TeamScreenProps {
  onNext: (employees: Employee[]) => void
  onBack: () => void
}

type ViewMode = 'cards' | 'orgchart'

const roleOptions: RoleType[] = ['Gerant', 'Cuisinier', 'Serveur', 'Chef de rang', 'Livreur', 'Autre']
const contractOptions: ContractType[] = ['CDI', 'CDD', 'Temps partiel', 'Apprenti']
const timekeepingOptions: TimekeepingMethod[] = ['Timbreuse', 'Smartphone', 'Web']

const defaultEmployees: Employee[] = [
  {
    id: '1',
    name: 'Maria',
    role: 'Gerant',
    contractType: 'CDI',
    age: 42,
    drivingLicense: true,
    timekeepingMethods: ['Smartphone', 'Web'],
    managerId: null,
    startDate: '2019-03-15',
    avatarConfig: { color: '#D64933' }
  },
  {
    id: '2',
    name: 'Pablo',
    role: 'Cuisinier',
    contractType: 'CDI',
    age: 28,
    drivingLicense: false,
    timekeepingMethods: ['Smartphone'],
    managerId: '1',
    startDate: '2021-09-01',
    avatarConfig: { color: '#2D3436' }
  },
  {
    id: '3',
    name: 'Julie',
    role: 'Chef de rang',
    contractType: 'CDD',
    age: 23,
    drivingLicense: true,
    timekeepingMethods: ['Smartphone', 'Web'],
    managerId: '1',
    startDate: '2024-01-08',
    avatarConfig: { color: '#6C5CE7' }
  },
  {
    id: '4',
    name: 'Carlos',
    role: 'Livreur',
    contractType: 'CDI',
    age: 35,
    drivingLicense: true,
    timekeepingMethods: ['Smartphone'],
    managerId: '1',
    startDate: '2018-06-01',
    avatarConfig: { color: '#00B894' }
  }
]

const emptyEmployee: Omit<Employee, 'id'> = {
  name: '',
  age: 25,
  role: 'Serveur',
  contractType: 'CDI',
  drivingLicense: false,
  timekeepingMethods: ['Smartphone'],
  managerId: null,
  startDate: new Date().toISOString().split('T')[0],
  avatarConfig: { color: '#FF5200' }
}

export function TeamScreen({ onNext, onBack }: TeamScreenProps) {
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>(emptyEmployee)
  const [showOnboardingPopup, setShowOnboardingPopup] = useState(true)
  
  const [vyvyMessage, setVyvyMessage] = useState(
    "Voici l'equipe de la pizzeria demo ! Dans votre cas, renseignez vos vrais employes."
  )

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({ ...employee })
    setIsAddingNew(false)
    setVyvyMessage(`Tu modifies le profil de ${employee.name}. Ces informations sont importantes pour la gestion RH !`)
  }

  const handleAddNew = () => {
    setEditingEmployee(null)
    setFormData({ ...emptyEmployee })
    setIsAddingNew(true)
    setVyvyMessage("Super ! Tu ajoutes un nouvel employe. Remplis bien toutes les informations !")
  }

  const handleSaveEmployee = () => {
    if (!formData.name.trim()) return
    
    if (isAddingNew) {
      const newEmployee: Employee = {
        ...formData,
        id: crypto.randomUUID()
      }
      setEmployees([...employees, newEmployee])
      setVyvyMessage(`${newEmployee.name} a rejoint l'equipe ! Bienvenue !`)
    } else if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? { ...formData, id: emp.id } : emp
      ))
      setVyvyMessage(`Les informations de ${formData.name} ont ete mises a jour.`)
    }
    
    setEditingEmployee(null)
    setIsAddingNew(false)
    setFormData(emptyEmployee)
  }

  const handleDeleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id)
    setEmployees(employees.filter(e => e.id !== id))
    if (emp) {
      setVyvyMessage(`${emp.name} a quitte l'equipe.`)
    }
  }

  const handleTimekeepingChange = (method: TimekeepingMethod, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        timekeepingMethods: [...formData.timekeepingMethods, method]
      })
    } else {
      setFormData({
        ...formData,
        timekeepingMethods: formData.timekeepingMethods.filter(m => m !== method)
      })
    }
  }

  const getCharacterComponent = (employee: Employee, isHighlighted: boolean) => {
    const props = {
      expression: isHighlighted ? 'excited' : 'neutral' as const,
      isHighlighted,
      size: 'sm' as const
    }
    
    switch (employee.name.toLowerCase()) {
      case 'maria': return <Maria {...props} />
      case 'pablo': return <Pablo {...props} />
      case 'julie': return <Julie {...props} />
      case 'carlos': return <Carlos {...props} />
      default: return (
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: employee.avatarConfig.color || '#FF5200' }}
        >
          {employee.name.charAt(0).toUpperCase()}
        </div>
      )
    }
  }

  const manager = employees.find(e => e.managerId === null)
  const subordinates = employees.filter(e => e.managerId !== null)

  return (
    <div className="space-y-6">
      {/* Onboarding popup — shown on first visit */}
      <Dialog open={showOnboardingPopup} onOpenChange={setShowOnboardingPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-primary" />
              </div>
              Avant de commencer
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-foreground leading-relaxed">
              Dans cette etape, vous voyez une <strong>equipe de demonstration</strong> (pizzeria fictive). 
            </p>
            <div className="bg-primary/5 border border-primary/15 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-sm text-foreground">Dans votre vraie utilisation :</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  Supprimez les employes de demo
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  Ajoutez vos vrais employes avec leurs informations reelles
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  Ces donnees permettront a Vysual de personnaliser votre solution
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Pour cette demo, vous pouvez garder l'equipe telle quelle et cliquer sur "Continuer".
            </p>
          </div>
          <DialogFooter>
            <Button 
              size="lg" 
              onClick={() => setShowOnboardingPopup(false)}
              className="w-full font-semibold"
            >
              J'ai compris, continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          Configuration de l'equipe
        </h2>
        <p className="text-muted-foreground text-sm">
          Gerez votre equipe et leurs informations contractuelles
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* VyvyBot sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 space-y-4">
            <VyvyBot message={vyvyMessage} expression="happy" size="sm" />
            
            {/* Stats */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Employes</span>
                  <span className="font-bold">{employees.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CDI</span>
                  <span className="font-bold">{employees.filter(e => e.contractType === 'CDI').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CDD</span>
                  <span className="font-bold">{employees.filter(e => e.contractType === 'CDD').length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* View toggle + Add button */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Fiches
              </Button>
              <Button
                variant={viewMode === 'orgchart' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('orgchart')}
                className="gap-2"
              >
                <GitBranch className="w-4 h-4" />
                Organigramme
              </Button>
            </div>
            
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un employe
            </Button>
          </div>

          {/* Cards View */}
          <AnimatePresence mode="wait">
            {viewMode === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid sm:grid-cols-2 gap-4"
              >
                {employees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group hover:border-primary/40 hover:shadow-sm transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {getCharacterComponent(employee, false)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold truncate">{employee.name}</h3>
                                <p className="text-sm text-muted-foreground">{employee.role}</p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditEmployee(employee)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                employee.contractType === 'CDI' 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {employee.contractType}
                              </span>
                              {employee.drivingLicense && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground flex items-center gap-1">
                                  <Car className="w-3 h-3" />
                                  Permis
                                </span>
                              )}
                            </div>
                            
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {employee.age} ans
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {employee.timekeepingMethods.join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Org Chart View */}
            {viewMode === 'orgchart' && (
              <motion.div
                key="orgchart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Organigramme</CardTitle>
                    <CardDescription>Structure hierarchique de l'equipe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      {/* Manager */}
                      {manager && (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center"
                        >
                          <Card 
                            className="p-4 cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleEditEmployee(manager)}
                          >
                            <div className="flex flex-col items-center gap-2">
                              {getCharacterComponent(manager, false)}
                              <div className="text-center">
                                <p className="font-semibold">{manager.name}</p>
                                <p className="text-xs text-muted-foreground">{manager.role}</p>
                              </div>
                            </div>
                          </Card>
                          
                          {/* Connection line */}
                          {subordinates.length > 0 && (
                            <div className="w-0.5 h-8 bg-border" />
                          )}
                        </motion.div>
                      )}
                      
                      {/* Subordinates */}
                      {subordinates.length > 0 && (
                        <div className="relative">
                          {/* Horizontal line */}
                          <div 
                            className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-border"
                            style={{ width: `${Math.min(subordinates.length * 140, 500)}px` }}
                          />
                          
                          <div className="flex flex-wrap justify-center gap-4 pt-8">
                            {subordinates.map((emp, index) => (
                              <motion.div
                                key={emp.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center"
                              >
                                {/* Vertical connector */}
                                <div className="w-0.5 h-4 bg-border -mt-4 mb-2" />
                                
                                <Card 
                                  className="p-3 cursor-pointer hover:border-primary transition-colors"
                                  onClick={() => handleEditEmployee(emp)}
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    {getCharacterComponent(emp, false)}
                                    <div className="text-center">
                                      <p className="font-medium text-sm">{emp.name}</p>
                                      <p className="text-xs text-muted-foreground">{emp.role}</p>
                                    </div>
                                  </div>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={editingEmployee !== null || isAddingNew} onOpenChange={(open) => {
        if (!open) {
          setEditingEmployee(null)
          setIsAddingNew(false)
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isAddingNew ? 'Nouvel employe' : `Modifier ${editingEmployee?.name}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Prenom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Prenom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value as RoleType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Type de contrat</Label>
              <Select 
                value={formData.contractType} 
                onValueChange={(value) => setFormData({ ...formData, contractType: value as ContractType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contractOptions.map(contract => (
                    <SelectItem key={contract} value={contract}>{contract}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="driving">Permis de conduire</Label>
              <Switch
                id="driving"
                checked={formData.drivingLicense}
                onCheckedChange={(checked) => setFormData({ ...formData, drivingLicense: checked })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Methode de pointage</Label>
              <div className="flex flex-wrap gap-4">
                {timekeepingOptions.map(method => (
                  <div key={method} className="flex items-center gap-2">
                    <Checkbox
                      id={method}
                      checked={formData.timekeepingMethods.includes(method)}
                      onCheckedChange={(checked) => handleTimekeepingChange(method, !!checked)}
                    />
                    <Label htmlFor={method} className="text-sm font-normal">{method}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Superieur hierarchique</Label>
              <Select 
                value={formData.managerId || 'none'} 
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  managerId: value === 'none' ? null : value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucun (poste de direction)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun (poste de direction)</SelectItem>
                  {employees
                    .filter(e => e.id !== editingEmployee?.id)
                    .map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingEmployee(null)
              setIsAddingNew(false)
            }}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSaveEmployee} disabled={!formData.name.trim()}>
              <Check className="w-4 h-4 mr-2" />
              {isAddingNew ? 'Ajouter' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between gap-4 pt-8"
      >
        <Button 
          variant="outline" 
          size="lg"
          onClick={onBack}
          className="flex items-center gap-2 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </Button>
        <Button 
          size="lg" 
          onClick={() => onNext(employees)}
          className="flex items-center gap-2 font-semibold shadow-lg shadow-primary/20"
        >
          Continuer
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}
