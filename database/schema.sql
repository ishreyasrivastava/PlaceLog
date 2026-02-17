-- PlaceLog Database Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor → New Query)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    college VARCHAR(200),
    batch VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    year VARCHAR(10) NOT NULL,
    outcome VARCHAR(50) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20),
    rounds INTEGER,
    questions TEXT[] DEFAULT '{}',
    tips TEXT,
    experience TEXT NOT NULL,
    ctc_offered VARCHAR(50),
    author_name VARCHAR(100),
    author_college VARCHAR(200),
    author_batch VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_company ON experiences(company);
CREATE INDEX IF NOT EXISTS idx_experiences_year ON experiences(year);
CREATE INDEX IF NOT EXISTS idx_experiences_outcome ON experiences(outcome);
CREATE INDEX IF NOT EXISTS idx_experiences_created_at ON experiences(created_at DESC);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Auth users can create experiences" ON experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiences" ON experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experiences" ON experiences FOR DELETE USING (auth.uid() = user_id);

GRANT ALL ON profiles TO authenticated;
GRANT ALL ON experiences TO authenticated;
GRANT SELECT ON profiles TO anon;
GRANT SELECT ON experiences TO anon;

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER experiences_updated_at
    BEFORE UPDATE ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
