-- =============================================================
-- 010: State of the Society Address (SOSA) Archive
-- =============================================================
-- SOSA reports delivered by the President per Constitution Art. 8,
-- Sec. 4(i). Public-facing archive with admin management.
-- =============================================================

CREATE TABLE IF NOT EXISTS sosa_reports (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  president_name            text NOT NULL,
  semester                  text NOT NULL,
  academic_year             text NOT NULL,
  delivered_date            date,
  financial_health          text NOT NULL,
  departmental_progress     text NOT NULL,
  house_performance         text NOT NULL,
  presidential_vision       text NOT NULL,
  additional_remarks        text,
  status                    text NOT NULL DEFAULT 'draft',
  is_published              boolean NOT NULL DEFAULT false
);

ALTER TABLE sosa_reports ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published reports only
CREATE POLICY "Anyone can view published SOSA reports"
  ON sosa_reports
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Authenticated can SELECT all (including drafts)
CREATE POLICY "Authenticated users can view all SOSA reports"
  ON sosa_reports
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated users can insert SOSA reports"
  ON sosa_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update SOSA reports"
  ON sosa_reports
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete SOSA reports"
  ON sosa_reports
  FOR DELETE
  TO authenticated
  USING (true);
