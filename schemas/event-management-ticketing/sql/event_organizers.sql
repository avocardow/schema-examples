-- event_organizers: Maps users to events with specific organizational roles.
-- See README.md for full design rationale.

CREATE TYPE organizer_role AS ENUM ('owner', 'admin', 'moderator', 'check_in_staff');

CREATE TABLE event_organizers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL,
  user_id             UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role                organizer_role NOT NULL DEFAULT 'admin',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX idx_event_organizers_user_id ON event_organizers (user_id);

-- Forward FK: events loads after this file alphabetically.
ALTER TABLE event_organizers
  ADD CONSTRAINT fk_event_organizers_event
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE;
