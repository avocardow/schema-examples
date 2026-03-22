-- notification_threads: Thread-level state for grouping related notifications with per-thread read tracking and metadata.
-- See README.md for full design rationale and field documentation.

CREATE TABLE notification_threads (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_key          TEXT UNIQUE NOT NULL,              -- e.g., "issue:456", "pr:789". Must match the thread_key on events.

  -- Thread metadata: displayed in the thread list UI.
  title               TEXT,                              -- e.g., "Fix login bug (#456)". Can be updated as the thread evolves.
  icon                TEXT,                              -- Icon URL or icon identifier for the thread.
  category_id         UUID REFERENCES notification_categories(id) ON DELETE SET NULL,

  -- Counter cache: avoids COUNT(*) on every thread list render.
  notification_count  INTEGER NOT NULL DEFAULT 0,

  last_activity_at    TIMESTAMPTZ,                       -- When the most recent event in this thread occurred. For sorting threads.
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_threads_category_id ON notification_threads (category_id);
CREATE INDEX idx_notification_threads_last_activity_at ON notification_threads (last_activity_at);
