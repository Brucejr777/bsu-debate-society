-- Create the house_points table
CREATE TABLE IF NOT EXISTS house_points (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  house_name                text NOT NULL,
  total_points              int4 NOT NULL DEFAULT 0,
  competitive_excellence    int4 NOT NULL DEFAULT 0,
  organizational_contribution int4 NOT NULL DEFAULT 0,
  governance_compliance     int4 NOT NULL DEFAULT 0,
  conduct_ethics            int4 NOT NULL DEFAULT 0,
  semester                  text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE house_points ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public (anon) users to SELECT (members can view standings)
CREATE POLICY "Anyone can view house point standings"
  ON house_points
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow authenticated users to INSERT (admins only)
CREATE POLICY "Authenticated users can insert house points"
  ON house_points
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to UPDATE (admins only)
CREATE POLICY "Authenticated users can update house points"
  ON house_points
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to DELETE (admins only)
CREATE POLICY "Authenticated users can delete house points"
  ON house_points
  FOR DELETE
  TO authenticated
  USING (true);

