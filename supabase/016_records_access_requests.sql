-- =============================================================
-- 016: Records Access Requests
-- =============================================================
-- Per Article VIII, Section 4: Any active member may request
-- access to Public or Restricted Records by submitting a written
-- Access Request Form to the Executive Secretary.
-- =============================================================

CREATE TABLE IF NOT EXISTS records_access_requests (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at                timestamptz NOT NULL DEFAULT now(),
  requester_name            text NOT NULL,
  requester_house           text NOT NULL,
  requester_email           text NOT NULL,
  records_classification    text NOT NULL,
  specific_records_sought   text NOT NULL,
  purpose                   text NOT NULL,
  preferred_format          text NOT NULL,
  scope                     text NOT NULL,
  additional_notes          text,
  status                    text NOT NULL DEFAULT 'pending',
  processed_by              text,
  processing_notes          text,
  processed_at              timestamptz,
  fulfilled_at              timestamptz
);

ALTER TABLE records_access_requests ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (submit request)
CREATE POLICY "Public can submit records access requests"
  ON records_access_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated can SELECT, UPDATE, DELETE
CREATE POLICY "Authenticated users can view records access requests"
  ON records_access_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update records access requests"
  ON records_access_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete records access requests"
  ON records_access_requests
  FOR DELETE
  TO authenticated
  USING (true);
