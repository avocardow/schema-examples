-- deal_activities: Append-only audit trail of deal changes for pipeline analytics.
-- See README.md for full design rationale.

CREATE TYPE deal_activity_action AS ENUM ('created', 'updated', 'stage_changed', 'won', 'lost', 'reopened');

CREATE TABLE deal_activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id     UUID NOT NULL REFERENCES deals (id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users (id) ON DELETE SET NULL,
  action      deal_activity_action NOT NULL,
  field       TEXT,
  old_value   TEXT,
  new_value   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deal_activities_deal_id_created_at ON deal_activities (deal_id, created_at);
CREATE INDEX idx_deal_activities_user_id ON deal_activities (user_id);
