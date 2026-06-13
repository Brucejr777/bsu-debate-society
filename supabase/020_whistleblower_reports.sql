-- Create the whistleblower_reports table for secure, confidential reporting
CREATE TABLE IF NOT EXISTS whistleblower_reports (
    id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at                timestamptz NOT NULL DEFAULT now(),
    is_anonymous              boolean NOT NULL DEFAULT true,
    contact_method            text,
    misconduct_types          text[] NOT NULL,
    parties_involved          text,
    factual_summary           text NOT NULL,
    supporting_documentation  text,
    status                    text NOT NULL DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE whistleblower_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public (anon) users to INSERT (submit reports securely)
CREATE POLICY "Anyone can submit whistleblower reports"
ON whistleblower_reports
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow authenticated users to SELECT (admin/OIA review)
CREATE POLICY "Authenticated users can view whistleblower reports"
ON whistleblower_reports
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to UPDATE (admin status updates)
CREATE POLICY "Authenticated users can update whistleblower reports"
ON whistleblower_reports
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to DELETE
CREATE POLICY "Authenticated users can delete whistleblower reports"
ON whistleblower_reports
FOR DELETE
TO authenticated
USING (true);