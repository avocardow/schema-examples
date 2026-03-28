-- transcripts: Episode transcripts in multiple formats, supporting both manual and auto-generated captions.
-- See README.md for full design rationale.

CREATE TYPE transcript_format_enum AS ENUM ('srt', 'vtt', 'json', 'text');

CREATE TABLE transcripts (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id       UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    format           transcript_format_enum NOT NULL,
    content_url      TEXT,
    content          TEXT,
    language         TEXT NOT NULL DEFAULT 'en',
    is_auto_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transcripts_episode_id_format_language ON transcripts (episode_id, format, language);
