-- breakout_rooms: Smaller sub-rooms within a meeting for group activities.
-- See README.md for full design rationale and field documentation.

CREATE TYPE breakout_room_status AS ENUM ('pending', 'open', 'closed');

CREATE TABLE breakout_rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  status      breakout_room_status NOT NULL DEFAULT 'pending',
  opened_at   TIMESTAMPTZ,
  closed_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_breakout_rooms_meeting_id_position ON breakout_rooms (meeting_id, position);
CREATE INDEX idx_breakout_rooms_meeting_id_status ON breakout_rooms (meeting_id, status);
