-- =============================================================
-- 014: House Cup Historical Winners
-- =============================================================
-- Tracks annual House Cup champions, trophy details, and
-- material benefits per Article I, Section 9 of Rules.
-- =============================================================

CREATE TABLE IF NOT EXISTS house_cup_winners (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  academic_year             text NOT NULL,
  winning_house             text NOT NULL,
  final_points              int4 NOT NULL,
  runner_up_house           text,
  runner_up_points          int4,
  tiebreaker_used           text,
  notable_achievements      text,
  published                 boolean NOT NULL DEFAULT true
);

ALTER TABLE house_cup_winners ENABLE ROW LEVEL SECURITY;

-- Public can SELECT
CREATE POLICY "Anyone can view house cup winners"
  ON house_cup_winners
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated users can insert house cup winners"
  ON house_cup_winners
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update house cup winners"
  ON house_cup_winners
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete house cup winners"
  ON house_cup_winners
  FOR DELETE
  TO authenticated
  USING (true);
