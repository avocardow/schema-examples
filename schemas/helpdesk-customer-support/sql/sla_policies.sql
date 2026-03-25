-- sla_policies: Service-level agreement definitions governing response and resolution times.
-- See README.md for full design rationale.

CREATE TABLE sla_policies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  schedule_id UUID REFERENCES business_schedules (id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sla_policies_active_sort ON sla_policies (is_active, sort_order);
