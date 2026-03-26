-- events: Core event records with scheduling, status, and registration details.
-- See README.md for full design rationale.

CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'postponed', 'completed');
CREATE TYPE event_visibility AS ENUM ('public', 'private', 'unlisted');

CREATE TABLE events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id             UUID REFERENCES event_series (id) ON DELETE SET NULL,
  category_id           UUID REFERENCES event_categories (id) ON DELETE SET NULL,
  venue_id              UUID,
  title                 TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  summary               TEXT,
  description           TEXT,
  cover_image_url       TEXT,
  start_time            TIMESTAMPTZ NOT NULL,
  end_time              TIMESTAMPTZ NOT NULL,
  timezone              TEXT NOT NULL,
  is_all_day            BOOLEAN NOT NULL DEFAULT FALSE,
  max_attendees         INTEGER,
  status                event_status NOT NULL DEFAULT 'draft',
  visibility            event_visibility NOT NULL DEFAULT 'public',
  registration_open_at  TIMESTAMPTZ,
  registration_close_at TIMESTAMPTZ,
  is_free               BOOLEAN NOT NULL DEFAULT FALSE,
  contact_email         TEXT,
  website_url           TEXT,
  created_by            UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_series_id ON events (series_id);
CREATE INDEX idx_events_category_id ON events (category_id);
CREATE INDEX idx_events_venue_id ON events (venue_id);
CREATE INDEX idx_events_status_start_time ON events (status, start_time);
CREATE INDEX idx_events_visibility ON events (visibility);
CREATE INDEX idx_events_start_time_end_time ON events (start_time, end_time);
CREATE INDEX idx_events_created_by ON events (created_by);

-- Forward FK: venues loads after this file alphabetically.
ALTER TABLE events
  ADD CONSTRAINT fk_events_venue
  FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE SET NULL;
