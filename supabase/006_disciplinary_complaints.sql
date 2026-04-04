CREATE TABLE disciplinary_complaints (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  complainant_name TEXT NOT NULL,
  complainant_house TEXT,
  respondent_name TEXT NOT NULL,
  respondent_house TEXT,
  incident_date DATE NOT NULL,
  incident_time TIME,
  incident_location TEXT NOT NULL,
  violation_type TEXT,
  provisions_violated TEXT,
  description TEXT NOT NULL,
  evidence_summary TEXT,
  witnesses TEXT,
  status TEXT DEFAULT 'filed',
  notes TEXT,
  sanction TEXT
);