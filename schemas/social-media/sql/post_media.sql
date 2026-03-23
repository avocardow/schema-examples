-- post_media: Media attachments (images, videos, GIFs) linked to posts.
-- See README.md for full design rationale and field documentation.

CREATE TYPE media_type AS ENUM ('image', 'video', 'gif');

CREATE TABLE post_media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL,
  file_id     UUID NOT NULL REFERENCES files (id) ON DELETE RESTRICT,
  media_type  media_type NOT NULL,
  width       INTEGER,
  height      INTEGER,
  alt_text    TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: posts loads after post_media alphabetically.
ALTER TABLE post_media
  ADD CONSTRAINT fk_post_media_post_id
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;

CREATE INDEX idx_post_media_post_id_position ON post_media (post_id, position);
CREATE INDEX idx_post_media_file_id ON post_media (file_id);
