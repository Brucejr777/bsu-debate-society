-- Create the membership_applications table
CREATE TABLE IF NOT EXISTS membership_applications (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at   timestamptz NOT NULL DEFAULT now(),
  full_name    text NOT NULL,
  student_id   text NOT NULL,
  college      text NOT NULL,
  house_choice text NOT NULL,
  email        text NOT NULL,
  phone        text,
  status       text NOT NULL DEFAULT 'pending',
  comments     text
);

-- Enable Row Level Security
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public (anon) users to INSERT (submit the membership application)
CREATE POLICY "Anyone can submit a membership application"
  ON membership_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to SELECT (admins can view applications)
CREATE POLICY "Authenticated users can view membership applications"
  ON membership_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to UPDATE (admins can change status, add comments)
CREATE POLICY "Authenticated users can update membership applications"
  ON membership_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to DELETE (admins can remove applications)
CREATE POLICY "Authenticated users can delete membership applications"
  ON membership_applications
  FOR DELETE
  TO authenticated
  USING (true);
