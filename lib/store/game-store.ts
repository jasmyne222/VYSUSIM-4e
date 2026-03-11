import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  GameScreen, 
  Employee, 
  GameSession,
  OrgChartNode,
  MissionJulieData,
  MissionPabloData,
  MissionDismissalData
} from '@/lib/types/game'

interface GameStore {
  // State
  session: GameSession | null
  currentScreen: GameScreen
  loading: boolean
  
  // Actions
  setScreen: (screen: GameScreen) => void
  startNewGame: () => void
  
  // Team actions
  updateTeam: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  removeEmployee: (id: string) => void
  updateOrgChart: (orgChart: OrgChartNode[]) => void
  
  // Mission actions
  saveMissionJulie: (data: MissionJulieData) => void
  saveMissionPablo: (data: MissionPabloData) => void
  saveMissionDismissal: (data: MissionDismissalData) => void
  
  completeGame: () => void
  resetGame: () => void
  
  // Getters
  getReportData: () => GameSession | null
}

const createNewSession = (): GameSession => ({
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'in_progress',
  currentScreen: 'welcome',
  teamConfig: [],
  orgChart: [],
  missionJulie: null,
  missionPablo: null,
  missionDismissal: null,
  metadata: {}
})

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      session: null,
      currentScreen: 'welcome',
      loading: false,

      setScreen: (screen) => {
        set({ currentScreen: screen })
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              currentScreen: screen,
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      startNewGame: () => {
        const newSession = createNewSession()
        set({
          session: newSession,
          currentScreen: 'welcome'
        })
      },

      updateTeam: (employees) => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              teamConfig: employees,
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      addEmployee: (employee) => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              teamConfig: [...session.teamConfig, employee],
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      updateEmployee: (id, updates) => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              teamConfig: session.teamConfig.map(emp =>
                emp.id === id ? { ...emp, ...updates } : emp
              ),
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      removeEmployee: (id) => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              teamConfig: session.teamConfig.filter(emp => emp.id !== id),
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      updateOrgChart: (orgChart) => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              orgChart,
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      saveMissionJulie: (data) => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              missionJulie: data,
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      saveMissionPablo: (data) => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              missionPablo: data,
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      saveMissionDismissal: (data) => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              missionDismissal: data,
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      completeGame: () => {
        const session = get().session
        if (session) {
          set({
            session: {
              ...session,
              status: 'completed',
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      resetGame: () => {
        set({
          session: null,
          currentScreen: 'welcome'
        })
      },

      getReportData: () => {
        return get().session
      }
    }),
    {
      name: 'vysual-hr-game'
    }
  )
)
