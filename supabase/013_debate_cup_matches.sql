-- =============================================================
-- 013: Inter-House Debate Cup — Matches, Results, Standings
-- =============================================================
-- Round-robin format: each House debates every other House once
-- per semester (6 matches total with 4 Houses).
-- Per Article I, Section 10(1): Win +15, Draw +7, Participation +3,
-- Best Team +5.
-- =============================================================

CREATE TABLE IF NOT EXISTS debate_cup_matches (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  semester                  text NOT NULL,
  round_number              int4 NOT NULL DEFAULT 1,
  match_date                date,
  match_time                time,
  venue                     text,
  virtual_link              text,
  house_a                   text NOT NULL,
  house_b                   text NOT NULL,
  motion                    text,
  status                    text NOT NULL DEFAULT 'scheduled',
  winner                    text,
  is_draw                   boolean NOT NULL DEFAULT false,
  best_team                 text,
  house_a_score             int4,
  house_b_score             int4,
  adjudicators              text,
  notes                     text,
  published                 boolean NOT NULL DEFAULT false
);

ALTER TABLE debate_cup_matches ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published matches
CREATE POLICY "Anyone can view published debate cup matches"
  ON debate_cup_matches
  FOR SELECT
  TO anon
  USING (published = true);

-- Authenticated can SELECT all
CREATE POLICY "Authenticated users can view all debate cup matches"
  ON debate_cup_matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert debate cup matches"
  ON debate_cup_matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update debate cup matches"
  ON debate_cup_matches
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete debate cup matches"
  ON debate_cup_matches
  FOR DELETE
  TO authenticated
  USING (true);
