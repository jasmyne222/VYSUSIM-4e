'use client'

import { useGameStore } from '@/lib/store/game-store'
import { GameLayout } from '@/components/game/game-layout'
import { ScreenTransition } from '@/components/game/screen-transition'
import { WelcomeScreen } from '@/components/screens/welcome-screen'
import { TeamScreen } from '@/components/screens/team-screen'
import { JulieMissionScreen } from '@/components/screens/julie-mission-screen'
import { PabloMissionScreen } from '@/components/screens/pablo-mission-screen'
import { DismissalMissionScreen } from '@/components/screens/dismissal-mission-screen'
import { ReportScreen } from '@/components/screens/report-screen'
import type { Employee, MissionJulieData, MissionPabloData, MissionDismissalData } from '@/lib/types/game'

export default function GamePage() {
  const { 
    currentScreen, 
    session,
    setScreen, 
    startNewGame, 
    updateTeam,
    saveMissionJulie,
    saveMissionPablo,
    saveMissionDismissal,
    completeGame,
    resetGame
  } = useGameStore()

  const handleStart = () => {
    startNewGame()
    setScreen('team')
  }

  const handleTeamComplete = (employees: Employee[]) => {
    updateTeam(employees)
    setScreen('mission-julie')
  }

  const handleJulieMissionComplete = (data: MissionJulieData) => {
    saveMissionJulie(data)
    setScreen('mission-pablo')
  }

  const handlePabloMissionComplete = (data: MissionPabloData) => {
    saveMissionPablo(data)
    setScreen('mission-dismissal')
  }

  const handleDismissalMissionComplete = (data: MissionDismissalData) => {
    saveMissionDismissal(data)
    completeGame()
    setScreen('report')
  }

  const handleRestart = () => {
    resetGame()
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
      case 'mission-julie':
        return (
          <JulieMissionScreen
            onComplete={handleJulieMissionComplete}
            onBack={() => setScreen('team')}
          />
        )
      case 'mission-pablo':
        return (
          <PabloMissionScreen
            onComplete={handlePabloMissionComplete}
            onBack={() => setScreen('mission-julie')}
          />
        )
      case 'mission-dismissal':
        return (
          <DismissalMissionScreen
            employees={session?.teamConfig || []}
            onComplete={handleDismissalMissionComplete}
            onBack={() => setScreen('mission-pablo')}
          />
        )
      case 'report':
        return (
          <ReportScreen
            session={session}
            onRestart={handleRestart}
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
