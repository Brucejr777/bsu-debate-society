-- =============================================================
-- 015: House of the Semester Recognition
-- =============================================================
-- Per Article I, Section 9(4): awarded to the top House at the
-- end of each semester. Receives certificate, public recognition,
-- and +10 bonus points carried to next semester.
-- =============================================================

CREATE TABLE IF NOT EXISTS house_of_semester (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  semester                  text NOT NULL,
  academic_year             text NOT NULL,
  winning_house             text NOT NULL,
  final_points              int4 NOT NULL,
  bonus_points_awarded      int4 NOT NULL DEFAULT 10,
  certificate_issued        boolean NOT NULL DEFAULT true,
  notes                     text,
  published                 boolean NOT NULL DEFAULT true
);

ALTER TABLE house_of_semester ENABLE ROW LEVEL SECURITY;

-- Public can SELECT
CREATE POLICY "Anyone can view house of semester records"
  ON house_of_semester
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated users can insert house of semester"
  ON house_of_semester
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update house of semester"
  ON house_of_semester
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete house of semester"
  ON house_of_semester
  FOR DELETE
  TO authenticated
  USING (true);
