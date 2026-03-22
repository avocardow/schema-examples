-- events: Core event log capturing user and anonymous interactions with full context.
-- See README.md for full design rationale.

CREATE TABLE events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id UUID NOT NULL REFERENCES event_types(id) ON DELETE RESTRICT,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id  TEXT,
  session_id    UUID,
  timestamp     TIMESTAMPTZ NOT NULL,
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
  properties    JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: sessions is defined in sessions.sql (loaded after events.sql alphabetically).
ALTER TABLE events ADD CONSTRAINT fk_events_session_id
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;

CREATE INDEX idx_events_event_type_id ON events (event_type_id);
CREATE INDEX idx_events_user_id_timestamp ON events (user_id, timestamp);
CREATE INDEX idx_events_session_id ON events (session_id);
CREATE INDEX idx_events_timestamp ON events (timestamp);
CREATE INDEX idx_events_campaign_id ON events (campaign_id);
CREATE INDEX idx_events_anonymous_id ON events (anonymous_id);
CREATE INDEX idx_events_country ON events (country);
