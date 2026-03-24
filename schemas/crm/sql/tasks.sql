-- tasks: Action items assigned to users, optionally linked to contacts, companies, or deals.
-- See README.md for full design rationale.

-- deal_priority enum is defined in deals.sql (shared).

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed', 'cancelled');

CREATE TABLE tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  due_date     TEXT,
  priority     deal_priority NOT NULL DEFAULT 'medium',
  status       task_status NOT NULL DEFAULT 'todo',
  completed_at TIMESTAMPTZ,
  contact_id   UUID REFERENCES contacts (id) ON DELETE SET NULL,
  company_id   UUID REFERENCES companies (id) ON DELETE SET NULL,
  deal_id      UUID REFERENCES deals (id) ON DELETE SET NULL,
  owner_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_owner_status ON tasks (owner_id, status);
CREATE INDEX idx_tasks_due_date ON tasks (due_date);
CREATE INDEX idx_tasks_contact_id ON tasks (contact_id);
CREATE INDEX idx_tasks_deal_id ON tasks (deal_id);
