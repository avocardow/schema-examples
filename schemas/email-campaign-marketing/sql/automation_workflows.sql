-- automation_workflows: Configurable automated email sequences triggered by events.
-- See README.md for full design rationale.

CREATE TYPE automation_trigger_type AS ENUM ('list_join', 'tag_added', 'manual', 'event');

CREATE TABLE automation_workflows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    description     TEXT,
    trigger_type    automation_trigger_type NOT NULL,
    trigger_config  JSONB DEFAULT '{}'::jsonb,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automation_workflows_is_active ON automation_workflows (is_active);
CREATE INDEX idx_automation_workflows_trigger_type ON automation_workflows (trigger_type);
