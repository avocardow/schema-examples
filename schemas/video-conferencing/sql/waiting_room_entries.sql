-- waiting_room_entries: Users waiting to be admitted into a meeting.
-- See README.md for full design rationale and field documentation.

CREATE TYPE waiting_room_status AS ENUM ('waiting', 'admitted', 'rejected');

CREATE TABLE waiting_room_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id    UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users (id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL,
  status        waiting_room_status NOT NULL DEFAULT 'waiting',
  admitted_by   UUID REFERENCES users (id) ON DELETE SET NULL,
  responded_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_waiting_room_entries_meeting_id_status ON waiting_room_entries (meeting_id, status);
CREATE INDEX idx_waiting_room_entries_meeting_id_created_at ON waiting_room_entries (meeting_id, created_at);
