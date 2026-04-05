-- =============================================================
-- 012: Individual Debate Point Transaction Ledger
-- =============================================================
-- Per Article III, Section 6: The Individual Debate Point Ledger
-- records the date, member name, House, points added, running
-- total, and specific activity or reason for each transaction.
-- =============================================================

CREATE TABLE IF NOT EXISTS individual_debate_point_transactions (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  member_name               text NOT NULL,
  house                     text NOT NULL,
  points                    int4 NOT NULL,
  reason                    text NOT NULL,
  evidence                  text,
  semester                  text NOT NULL,
  status                    text NOT NULL DEFAULT 'provisional',
  running_total             int4,
  reviewed_at               timestamptz,
  reviewed_by               text,
  notes                     text
);

ALTER TABLE individual_debate_point_transactions ENABLE ROW LEVEL SECURITY;

-- Public can SELECT all transactions (Article III, Section 6(2))
CREATE POLICY "Anyone can view individual debate point transactions"
  ON individual_debate_point_transactions
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated users can insert individual debate point transactions"
  ON individual_debate_point_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update individual debate point transactions"
  ON individual_debate_point_transactions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete individual debate point transactions"
  ON individual_debate_point_transactions
  FOR DELETE
  TO authenticated
  USING (true);
