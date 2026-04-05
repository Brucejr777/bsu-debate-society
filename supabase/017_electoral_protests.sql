-- =============================================================
-- 017: Electoral Disputes / Electoral Protests
-- =============================================================
-- Per Article VII, Section 10: Any House Chancellor may file an
-- electoral protest within 3 days of Proclamation on grounds of
-- procedural violation, vote tampering, or eligibility issues.
-- Adjudicated by the High Tribunal, presided by the Chief Adviser.
-- Decision is final and executory.
-- =============================================================

CREATE TABLE IF NOT EXISTS electoral_protests (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  protestant_name           text NOT NULL,
  protestant_house          text NOT NULL,
  protestant_email          text,
  protest_ground            text NOT NULL,
  specific_violations       text NOT NULL,
  evidence_summary          text NOT NULL,
  requested_relief          text NOT NULL,
  witnesses                 text,
  proclamation_date         date NOT NULL,
  filed_within_deadline     boolean NOT NULL DEFAULT true,
  status                    text NOT NULL DEFAULT 'filed',
  tribunal_notes            text,
  verdict                   text,
  verdict_date              timestamptz,
  presiding_authority       text,
  election_nullified        boolean,
  new_conclave_scheduled    date
);

ALTER TABLE electoral_protests ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (file protest)
CREATE POLICY "Public can file electoral protests"
  ON electoral_protests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated can SELECT, UPDATE, DELETE
CREATE POLICY "Authenticated users can view electoral protests"
  ON electoral_protests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update electoral protests"
  ON electoral_protests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete electoral protests"
  ON electoral_protests
  FOR DELETE
  TO authenticated
  USING (true);
