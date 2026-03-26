-- event_sessions: Individual sessions or tracks within a larger event.
-- See README.md for full design rationale.

CREATE TYPE session_status AS ENUM ('scheduled', 'cancelled', 'rescheduled');

CREATE TABLE event_sessions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL,
  venue_id            UUID,
  title               TEXT NOT NULL,
  description         TEXT,
  start_time          TIMESTAMPTZ NOT NULL,
  end_time            TIMESTAMPTZ NOT NULL,
  track               TEXT,
  max_attendees       INTEGER,
  position            INTEGER NOT NULL DEFAULT 0,
  status              session_status NOT NULL DEFAULT 'scheduled',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_sessions_event_id_start_time ON event_sessions (event_id, start_time);
CREATE INDEX idx_event_sessions_event_id_track ON event_sessions (event_id, track);
CREATE INDEX idx_event_sessions_status ON event_sessions (status);

-- Forward FK: events and venues load after this file alphabetically.
ALTER TABLE event_sessions
  ADD CONSTRAINT fk_event_sessions_event
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE;

ALTER TABLE event_sessions
  ADD CONSTRAINT fk_event_sessions_venue
  FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE SET NULL;
