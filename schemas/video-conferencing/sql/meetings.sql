-- meetings: Individual meeting sessions held within a room, tracking lifecycle and scheduling.
-- See README.md for full design rationale and field documentation.

CREATE TYPE meeting_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');

CREATE TABLE meetings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id           UUID NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
  title             TEXT,
  status            meeting_status NOT NULL DEFAULT 'scheduled',
  scheduled_start   TIMESTAMPTZ,
  scheduled_end     TIMESTAMPTZ,
  actual_start      TIMESTAMPTZ,
  actual_end        TIMESTAMPTZ,
  max_participants  INTEGER,
  enable_waiting_room BOOLEAN,
  host_id           UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  participant_count INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meetings_room_id_scheduled_start ON meetings (room_id, scheduled_start);
CREATE INDEX idx_meetings_host_id ON meetings (host_id);
CREATE INDEX idx_meetings_status ON meetings (status);
CREATE INDEX idx_meetings_scheduled_start ON meetings (scheduled_start);
CREATE INDEX idx_meetings_actual_start ON meetings (actual_start);
