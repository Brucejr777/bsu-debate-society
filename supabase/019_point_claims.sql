-- Create the point_claims table for member-submitted claims
CREATE TABLE IF NOT EXISTS point_claims (
    id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at                timestamptz NOT NULL DEFAULT now(),
    member_name               text NOT NULL,
    house                     text NOT NULL,
    membership_status         text NOT NULL,
    activity_date             date NOT NULL,
    activity_name             text NOT NULL,
    organizing_body           text NOT NULL,
    point_category            text NOT NULL,
    points_claimed            int4 NOT NULL,
    evidence_link             text NOT NULL,
    additional_notes          text,
    status                    text NOT NULL DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE point_claims ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public (anon) users to INSERT (submit claims)
CREATE POLICY "Anyone can submit point claims"
ON point_claims
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow authenticated users to SELECT, UPDATE, DELETE (admin review)
CREATE POLICY "Authenticated users can view point claims"
ON point_claims
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update point claims"
ON point_claims
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete point claims"
ON point_claims
FOR DELETE
TO authenticated
USING (true);