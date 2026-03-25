-- ticket_activities: Append-only audit trail of ticket changes for accountability and SLA debugging.
-- See README.md for full design rationale.

CREATE TYPE ticket_activity_action AS ENUM (
  'created', 'updated', 'status_changed', 'priority_changed',
  'assigned', 'escalated', 'reopened', 'resolved', 'closed', 'sla_breached'
);

CREATE TABLE ticket_activities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id  UUID NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users (id) ON DELETE SET NULL,
  action     ticket_activity_action NOT NULL,
  field      TEXT,
  old_value  TEXT,
  new_value  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_activities_ticket_id_created_at ON ticket_activities (ticket_id, created_at);
CREATE INDEX idx_ticket_activities_user_id ON ticket_activities (user_id);
