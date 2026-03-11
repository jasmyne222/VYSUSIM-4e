-- Vysual HR Game - Database Schema
-- Migration 001: Create game tables

-- Table: game_sessions
-- Stores each game playthrough
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  current_screen TEXT DEFAULT 'welcome',
  team_config JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table: game_decisions
-- Stores decisions made during missions
CREATE TABLE IF NOT EXISTS game_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  mission_id TEXT NOT NULL,
  decisions JSONB NOT NULL,
  character_name TEXT
);

-- Table: game_employees
-- Stores employee configurations for each session
CREATE TABLE IF NOT EXISTS game_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  contract_type TEXT,
  age INTEGER,
  start_date DATE,
  timekeeping_method TEXT,
  avatar_config JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_decisions_session_id ON game_decisions(session_id);
CREATE INDEX IF NOT EXISTS idx_game_employees_session_id ON game_employees(session_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for game_sessions updated_at
DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
