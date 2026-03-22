-- sessions: User browsing sessions with aggregated metrics, geo, and device context.
-- See README.md for full design rationale.

CREATE TABLE sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id  TEXT,
  started_at    TIMESTAMPTZ NOT NULL,
  ended_at      TIMESTAMPTZ,
  duration      INTEGER,
  page_count    INTEGER NOT NULL DEFAULT 0,
  event_count   INTEGER NOT NULL DEFAULT 0,
  is_bounce     BOOLEAN NOT NULL DEFAULT TRUE,
  entry_url     TEXT,
  exit_url      TEXT,
  ip_address    TEXT,
  user_agent    TEXT,
  device_type   TEXT,
  os            TEXT,
  browser       TEXT,
  country       TEXT,
  region        TEXT,
  city          TEXT,
  locale        TEXT,
  referrer      TEXT,
  campaign_id   UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id_started_at ON sessions (user_id, started_at);
CREATE INDEX idx_sessions_anonymous_id ON sessions (anonymous_id);
CREATE INDEX idx_sessions_started_at ON sessions (started_at);
CREATE INDEX idx_sessions_campaign_id ON sessions (campaign_id);
CREATE INDEX idx_sessions_country ON sessions (country);
CREATE INDEX idx_sessions_is_bounce ON sessions (is_bounce);
