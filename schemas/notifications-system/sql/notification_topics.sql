-- notification_topics: Named pub/sub groups for fan-out delivery.
-- See README.md for full design rationale and field documentation.

CREATE TABLE notification_topics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,                   -- Display name (e.g., "Project Updates", "Marketing Newsletter").
  slug            TEXT UNIQUE NOT NULL,            -- Identifier used in code and API (e.g., "project_updates", "marketing").
  description     TEXT,                            -- Explain what subscribing to this topic means.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- unique(slug) is already enforced by the UNIQUE constraint on the column.
