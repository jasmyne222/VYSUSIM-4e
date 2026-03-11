'use client'

import { useGameStore } from '@/lib/store/game-store'
import { GameLayout } from '@/components/game/game-layout'
import { ScreenTransition } from '@/components/game/screen-transition'
import { WelcomeScreen } from '@/components/screens/welcome-screen'
import { TeamScreen } from '@/components/screens/team-screen'
import { RestaurantScreen } from '@/components/screens/restaurant-screen'
import { JulieMissionScreen } from '@/components/screens/julie-mission-screen'
import type { Employee } from '@/lib/types/game'

export default function GamePage() {
  const { currentScreen, setScreen, startNewGame, updateTeam, addDecision } = useGameStore()

  const handleStart = () => {
    startNewGame()
    setScreen('team')
  }

  const handleTeamComplete = (employees: Employee[]) => {
    updateTeam(employees)
    setScreen('restaurant')
  }

  const handleRestaurantNext = () => {
    setScreen('mission-julie')
  }

  const handleMissionComplete = (decisions: Record<string, string>) => {
    addDecision({
      missionId: 'julie-integration',
      characterName: 'Julie',
      decisions
    })
    // For MVP, return to welcome after completion
    setScreen('welcome')
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />
      case 'team':
        return (
          <TeamScreen
            onNext={handleTeamComplete}
            onBack={() => setScreen('welcome')}
          />
        )
      case 'restaurant':
        return (
          <RestaurantScreen
            onNext={handleRestaurantNext}
            onBack={() => setScreen('team')}
          />
        )
      case 'mission-julie':
        return (
          <JulieMissionScreen
            onComplete={handleMissionComplete}
            onBack={() => setScreen('restaurant')}
          />
        )
      default:
        return <WelcomeScreen onStart={handleStart} />
    }
  }

  return (
    <GameLayout currentScreen={currentScreen}>
      <ScreenTransition screenKey={currentScreen}>
        {renderScreen()}
      </ScreenTransition>
    </GameLayout>
  )
}
