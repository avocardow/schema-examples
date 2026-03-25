-- tickets: Core support requests submitted by users and managed by agents.
-- See README.md for full design rationale.

CREATE TYPE ticket_type AS ENUM ('question', 'incident', 'problem', 'feature_request');

CREATE TYPE ticket_source AS ENUM ('email', 'web', 'phone', 'api', 'social');

CREATE TABLE tickets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject           TEXT NOT NULL,
  description       TEXT,
  status_id         UUID NOT NULL REFERENCES ticket_statuses (id) ON DELETE RESTRICT,
  priority_id       UUID NOT NULL REFERENCES ticket_priorities (id) ON DELETE RESTRICT,
  type              ticket_type NOT NULL DEFAULT 'question',
  source            ticket_source NOT NULL DEFAULT 'web',
  category_id       UUID REFERENCES ticket_categories (id) ON DELETE SET NULL,
  requester_id      UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  assigned_agent_id UUID REFERENCES users (id) ON DELETE SET NULL,
  assigned_team_id  UUID,
  sla_policy_id     UUID REFERENCES sla_policies (id) ON DELETE SET NULL,
  due_at            TIMESTAMPTZ,
  first_response_at TIMESTAMPTZ,
  resolved_at       TIMESTAMPTZ,
  closed_at         TIMESTAMPTZ,
  created_by        UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_status_id ON tickets (status_id);
CREATE INDEX idx_tickets_priority_id ON tickets (priority_id);
CREATE INDEX idx_tickets_requester_id ON tickets (requester_id);
CREATE INDEX idx_tickets_assigned_agent_id ON tickets (assigned_agent_id);
CREATE INDEX idx_tickets_assigned_team_id ON tickets (assigned_team_id);
CREATE INDEX idx_tickets_category_id ON tickets (category_id);
CREATE INDEX idx_tickets_sla_policy_id ON tickets (sla_policy_id);
CREATE INDEX idx_tickets_created_at ON tickets (created_at);
CREATE INDEX idx_tickets_due_at ON tickets (due_at);
