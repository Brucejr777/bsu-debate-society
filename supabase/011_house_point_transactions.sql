-- =============================================================
-- 011: House Point Transaction History
-- =============================================================
-- Individual point additions/deductions with dates, reasons,
-- evidence, and provisional/final status tracking.
-- Per Article I, Section 7(1): Master House Point Ledger must
-- record date, House, points, running total, category, activity,
-- proposing House, and final disposition.
-- =============================================================

CREATE TABLE IF NOT EXISTS house_point_transactions (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  house_name                text NOT NULL,
  category                  text NOT NULL,
  points                    int4 NOT NULL,
  reason                    text NOT NULL,
  evidence                  text,
  proposing_house           text,
  semester                  text NOT NULL,
  status                    text NOT NULL DEFAULT 'provisional',
  running_total             int4,
  reviewed_at               timestamptz,
  reviewed_by               text,
  notes                     text
);

ALTER TABLE house_point_transactions ENABLE ROW LEVEL SECURITY;

-- Public can SELECT all transactions (transparency)
CREATE POLICY "Anyone can view house point transactions"
  ON house_point_transactions
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated users can insert point transactions"
  ON house_point_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update point transactions"
  ON house_point_transactions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete point transactions"
  ON house_point_transactions
  FOR DELETE
  TO authenticated
  USING (true);
