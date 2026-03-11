import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameScreen, Employee, GameDecision, GameSession } from '@/lib/types/game'

interface GameStore {
  // State
  session: GameSession | null
  currentScreen: GameScreen
  loading: boolean
  
  // Actions
  setScreen: (screen: GameScreen) => void
  startNewGame: () => void
  updateTeam: (employees: Employee[]) => void
  addDecision: (decision: Omit<GameDecision, 'id' | 'sessionId' | 'createdAt'>) => void
  completeGame: () => void
  resetGame: () => void
}

const createNewSession = (): GameSession => ({
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'in_progress',
  currentScreen: 'welcome',
  teamConfig: [],
  decisions: [],
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

      addDecision: (decision) => {
        const session = get().session
        if (session) {
          const newDecision: GameDecision = {
            ...decision,
            id: crypto.randomUUID(),
            sessionId: session.id,
            createdAt: new Date().toISOString()
          }
          set({
            session: {
              ...session,
              decisions: [...session.decisions, newDecision],
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
      }
    }),
    {
      name: 'vysual-hr-game'
    }
  )
)
