-- rooms: Persistent or temporary video-conferencing rooms with configurable features.
-- See README.md for full design rationale and field documentation.

CREATE TYPE room_type AS ENUM ('permanent', 'temporary');

CREATE TABLE rooms (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  description           TEXT,
  type                  room_type NOT NULL DEFAULT 'permanent',
  max_participants      INTEGER,
  enable_waiting_room   BOOLEAN NOT NULL DEFAULT FALSE,
  enable_recording      BOOLEAN NOT NULL DEFAULT FALSE,
  enable_chat           BOOLEAN NOT NULL DEFAULT TRUE,
  enable_transcription  BOOLEAN NOT NULL DEFAULT FALSE,
  enable_breakout_rooms BOOLEAN NOT NULL DEFAULT FALSE,
  is_private            BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash         TEXT,
  created_by            UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_created_by ON rooms (created_by);
CREATE INDEX idx_rooms_type ON rooms (type);
CREATE INDEX idx_rooms_is_private ON rooms (is_private);
