-- notification_workflows: Orchestration definitions for multi-step notification delivery.
-- See README.md for full design rationale and field documentation.

CREATE TABLE notification_workflows (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,                    -- Display name (e.g., "Comment Notification", "Weekly Digest").
  slug                  TEXT UNIQUE NOT NULL,             -- Identifier used in code and API (e.g., "comment_notification").
  description           TEXT,

  -- Link to the category this workflow handles.
  -- A category can have multiple workflows (e.g., immediate + digest versions).
  category_id           UUID REFERENCES notification_categories(id) ON DELETE SET NULL,

  -- Critical workflows bypass user preferences entirely.
  -- Use sparingly: security alerts, billing failures, legal notices.
  is_critical           BOOLEAN NOT NULL DEFAULT FALSE,

  is_active             BOOLEAN NOT NULL DEFAULT TRUE,   -- Toggle a workflow without deleting it.

  -- The trigger identifier: what your app code calls to fire this workflow.
  -- Example: your app calls notificationService.trigger("comment_created", { ... })
  -- The system matches "comment_created" to this workflow's trigger_identifier.
  trigger_identifier    TEXT UNIQUE NOT NULL,             -- Must be unique. Used in API/SDK calls.

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- unique(slug) and unique(trigger_identifier) are already created by field constraints above.
CREATE INDEX idx_notification_workflows_category_id ON notification_workflows (category_id);
CREATE INDEX idx_notification_workflows_is_active ON notification_workflows (is_active);
