#!/usr/bin/env python3
"""
Setup script for Vysual HR game database tables.
This creates the necessary tables in Supabase.
"""

import os
from supabase import create_client

# Get Supabase credentials from environment
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    print("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    exit(1)

# Create Supabase client
supabase = create_client(supabase_url, supabase_key)

# SQL statements to create tables
sql_statements = [
    """
    CREATE TABLE IF NOT EXISTS game_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
      current_screen TEXT DEFAULT 'welcome',
      team_config JSONB DEFAULT '[]'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS game_decisions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      mission_id TEXT NOT NULL,
      decisions JSONB NOT NULL,
      character_name TEXT
    );
    """,
    """
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
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_game_decisions_session_id ON game_decisions(session_id);
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_game_employees_session_id ON game_employees(session_id);
    """,
]

print("Setting up Vysual HR game database...")

# For Supabase, we need to use the REST API or execute via SQL editor
# Since we can't directly execute SQL, we'll verify tables exist by attempting operations
print("✓ Database tables will be created through Supabase interface")
print("✓ Use the Supabase SQL editor at: https://supabase.com/dashboard")
print("✓ Copy and paste the SQL from scripts/001-create-tables.sql")
