-- session_speakers: Links speakers to event sessions with role and display order.
-- See README.md for full design rationale.

CREATE TYPE speaker_role AS ENUM ('speaker', 'moderator', 'panelist', 'host', 'keynote');

CREATE TABLE session_speakers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL REFERENCES event_sessions (id) ON DELETE CASCADE,
  speaker_id          UUID NOT NULL,
  role                speaker_role NOT NULL DEFAULT 'speaker',
  position            INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, speaker_id)
);

CREATE INDEX idx_session_speakers_speaker_id ON session_speakers (speaker_id);

-- Forward FK: speakers loads after this file alphabetically.
ALTER TABLE session_speakers
  ADD CONSTRAINT fk_session_speakers_speaker
  FOREIGN KEY (speaker_id) REFERENCES speakers (id) ON DELETE CASCADE;
