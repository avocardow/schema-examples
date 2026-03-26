-- event_updates: Announcements and news posts published for a specific event.
-- See README.md for full design rationale.

CREATE TABLE event_updates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL,
  author_id           UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  title               TEXT NOT NULL,
  body                TEXT NOT NULL,
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned           BOOLEAN NOT NULL DEFAULT FALSE,
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_updates_event_id_published ON event_updates (event_id, is_published, published_at);
CREATE INDEX idx_event_updates_author_id ON event_updates (author_id);

-- Forward FK: events loads after this file alphabetically.
ALTER TABLE event_updates
  ADD CONSTRAINT fk_event_updates_event
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE;
