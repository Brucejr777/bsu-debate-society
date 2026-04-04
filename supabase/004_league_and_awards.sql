-- Table 1: debate_league_members
CREATE TABLE IF NOT EXISTS debate_league_members (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at      timestamptz NOT NULL DEFAULT now(),
  member_name     text NOT NULL,
  house           text NOT NULL,
  individual_points int4 NOT NULL DEFAULT 0,
  semester        text NOT NULL,
  rank            int4 NOT NULL
);

-- Enable Row Level Security
ALTER TABLE debate_league_members ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public (anon) to SELECT (transparency)
CREATE POLICY "Anyone can view debate league members"
  ON debate_league_members
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow authenticated users to INSERT
CREATE POLICY "Authenticated users can insert debate league members"
  ON debate_league_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to UPDATE
CREATE POLICY "Authenticated users can update debate league members"
  ON debate_league_members
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to DELETE
CREATE POLICY "Authenticated users can delete debate league members"
  ON debate_league_members
  FOR DELETE
  TO authenticated
  USING (true);

-- Table 2: individual_awards
CREATE TABLE IF NOT EXISTS individual_awards (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at      timestamptz NOT NULL DEFAULT now(),
  member_name     text NOT NULL,
  house           text NOT NULL,
  award_category  text NOT NULL,
  tier            text NOT NULL,
  semester        text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE individual_awards ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public (anon) to SELECT (transparency)
CREATE POLICY "Anyone can view individual awards"
  ON individual_awards
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow authenticated users to INSERT
CREATE POLICY "Authenticated users can insert individual awards"
  ON individual_awards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to UPDATE
CREATE POLICY "Authenticated users can update individual awards"
  ON individual_awards
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to DELETE
CREATE POLICY "Authenticated users can delete individual awards"
  ON individual_awards
  FOR DELETE
  TO authenticated
  USING (true);

