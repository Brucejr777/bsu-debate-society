CREATE TABLE meetings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  meeting_type TEXT NOT NULL,
  title TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_time TIME,
  venue TEXT,
  virtual_link TEXT,
  agenda TEXT,
  presiding_officer TEXT,
  status TEXT DEFAULT 'scheduled',
  minutes TEXT,
  published BOOLEAN DEFAULT TRUE
);
