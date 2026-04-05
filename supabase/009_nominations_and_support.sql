-- =============================================================
-- 009: Individual Nominations & League Support Requests
-- =============================================================
-- Two new public-facing submission tables with admin-managed
-- status tracking.
-- =============================================================

-- ── Table: individual_nominations ──
-- Nominations for Individual Recognition (Article II of Rules)
CREATE TABLE IF NOT EXISTS individual_nominations (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  nominator_name            text NOT NULL,
  nominator_house           text NOT NULL,
  nominator_email           text,
  nominee_name              text NOT NULL,
  nominee_house             text NOT NULL,
  award_category            text NOT NULL,
  tier                      text,
  justification             text NOT NULL,
  supporting_documentation  text,
  semester                  text NOT NULL,
  status                    text NOT NULL DEFAULT 'pending',
  selection_notes           text
);

ALTER TABLE individual_nominations ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (submit nominations)
CREATE POLICY "Public can submit individual nominations"
  ON individual_nominations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated can SELECT, UPDATE, DELETE
CREATE POLICY "Authenticated users can view individual nominations"
  ON individual_nominations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update individual nominations"
  ON individual_nominations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete individual nominations"
  ON individual_nominations
  FOR DELETE
  TO authenticated
  USING (true);

-- ── Table: league_support_requests ──
-- Requests for tournament support (Article III, Section 4 of Rules)
CREATE TABLE IF NOT EXISTS league_support_requests (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  member_name               text NOT NULL,
  member_house              text NOT NULL,
  member_email              text NOT NULL,
  tournament_name           text NOT NULL,
  tournament_date           date NOT NULL,
  tournament_level          text NOT NULL,
  tournament_location       text,
  role_in_tournament        text NOT NULL DEFAULT 'debater',
  requested_support         text NOT NULL,
  estimated_cost            numeric(10,2),
  submission_deadline_met   boolean NOT NULL DEFAULT true,
  status                    text NOT NULL DEFAULT 'pending',
  approval_notes            text,
  post_tournament_report    text
);

ALTER TABLE league_support_requests ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (submit support requests)
CREATE POLICY "Public can submit league support requests"
  ON league_support_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated can SELECT, UPDATE, DELETE
CREATE POLICY "Authenticated users can view league support requests"
  ON league_support_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update league support requests"
  ON league_support_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete league support requests"
  ON league_support_requests
  FOR DELETE
  TO authenticated
  USING (true);
