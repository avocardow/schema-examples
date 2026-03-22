-- moderation_action_log: Immutable audit trail of all moderation-related events.
-- See README.md for full design rationale.

CREATE TABLE moderation_action_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  action_type       TEXT NOT NULL,                        -- What happened. Intentionally not an enum — new action types
                                                          -- should not require schema migration.
  target_type       TEXT NOT NULL,                        -- What entity the action was on (e.g., "queue_item", "report", "user").
  target_id         TEXT NOT NULL,                        -- ID of the target entity.

  details           JSONB,                                -- Event-specific context (e.g., action_taken: {"action_type": "ban", ...}).
  ip_address        TEXT,                                 -- Client IP address for security audit.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()    -- Append-only. No updated_at.
);

CREATE INDEX idx_moderation_action_log_actor_id ON moderation_action_log (actor_id);
CREATE INDEX idx_moderation_action_log_action_type ON moderation_action_log (action_type);
CREATE INDEX idx_moderation_action_log_target ON moderation_action_log (target_type, target_id);
CREATE INDEX idx_moderation_action_log_created_at ON moderation_action_log (created_at);
