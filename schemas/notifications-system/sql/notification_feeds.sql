-- notification_feeds: Named UI surfaces where notifications can appear (e.g., bell icon, activity tab, announcements banner).
-- See README.md for full design rationale and field documentation.

CREATE TABLE notification_feeds (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,                    -- Display name (e.g., "General", "Activity", "Announcements").
  slug            TEXT UNIQUE NOT NULL,             -- URL-safe identifier used in API calls: GET /feeds/general.
  description     TEXT,                             -- Explain what this feed is for. Shown in admin UI.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- unique(slug) is already enforced by the UNIQUE constraint above.
