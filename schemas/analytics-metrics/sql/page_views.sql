-- page_views: Individual page view records with URL, viewport, and duration details.
-- See README.md for full design rationale.

CREATE TABLE page_views (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        UUID REFERENCES events(id) ON DELETE SET NULL,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id    TEXT,
  session_id      UUID REFERENCES sessions(id) ON DELETE SET NULL,
  url             TEXT NOT NULL,
  path            TEXT NOT NULL,
  title           TEXT,
  referrer        TEXT,
  hostname        TEXT NOT NULL,
  viewport_width  INTEGER,
  viewport_height INTEGER,
  screen_width    INTEGER,
  screen_height   INTEGER,
  duration        INTEGER,
  timestamp       TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_page_views_user_id_timestamp ON page_views (user_id, timestamp);
CREATE INDEX idx_page_views_session_id ON page_views (session_id);
CREATE INDEX idx_page_views_path ON page_views (path);
CREATE INDEX idx_page_views_hostname_path ON page_views (hostname, path);
CREATE INDEX idx_page_views_timestamp ON page_views (timestamp);
CREATE INDEX idx_page_views_anonymous_id ON page_views (anonymous_id);
