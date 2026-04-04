CREATE TABLE financial_records (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  record_type TEXT NOT NULL CHECK (record_type IN ('snapshot', 'report')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  opening_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  income_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  expenses_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  closing_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  income_breakdown TEXT,
  expense_breakdown TEXT,
  notable_transactions TEXT,
  notes TEXT,
  published BOOLEAN DEFAULT TRUE
);
