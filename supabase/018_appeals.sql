-- =============================================================
-- 018: Appeal Forms — Point Disputes & Records Access Denials
-- =============================================================
-- Article I, Section 8: Appeals of final point transactions on
-- constitutional rights grounds, via written Appeal Form to
-- Council of House Chancellors.
-- Article VIII, Section 6: Appeals of records access denials
-- or classification decisions, submitted to High Council.
-- =============================================================

CREATE TABLE IF NOT EXISTS appeals (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  appeal_type               text NOT NULL,
  appellant_name            text NOT NULL,
  appellant_house           text NOT NULL,
  appellant_email           text,
  -- For point dispute appeals
  disputed_transaction_id   bigint,
  disputed_transaction_date date,
  constitutional_ground     text,
  -- For records access appeals
  denied_request_id         bigint,
  denial_reason             text,
  -- Common fields
  appeal_ground             text NOT NULL,
  statement_of_appeal       text NOT NULL,
  supporting_evidence       text,
  requested_relief          text NOT NULL,
  related_request_id        bigint,
  status                    text NOT NULL DEFAULT 'filed',
  presiding_authority       text,
  council_notes             text,
  decision                  text,
  decision_date             timestamptz,
  decision_outcome          text
);

ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (file appeal)
CREATE POLICY "Public can file appeals"
  ON appeals
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated can SELECT, UPDATE, DELETE
CREATE POLICY "Authenticated users can view appeals"
  ON appeals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update appeals"
  ON appeals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete appeals"
  ON appeals
  FOR DELETE
  TO authenticated
  USING (true);
