-- meeting_participants: Tracks each user's participation in a meeting with media state.
-- See README.md for full design rationale and field documentation.

CREATE TYPE participant_role AS ENUM ('host', 'co_host', 'moderator', 'attendee', 'viewer');

CREATE TABLE meeting_participants (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id        UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users (id) ON DELETE SET NULL,
  display_name      TEXT NOT NULL,
  role              participant_role NOT NULL DEFAULT 'attendee',
  joined_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at           TIMESTAMPTZ,
  duration_seconds  INTEGER,
  is_camera_on      BOOLEAN NOT NULL DEFAULT FALSE,
  is_mic_on         BOOLEAN NOT NULL DEFAULT FALSE,
  is_screen_sharing BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (meeting_id, user_id)
);

CREATE INDEX idx_meeting_participants_user_id ON meeting_participants (user_id);
CREATE INDEX idx_meeting_participants_meeting_id_joined_at ON meeting_participants (meeting_id, joined_at);
