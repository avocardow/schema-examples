-- post_slug_history: Historical slug records for redirect support after slug changes.
-- See README.md for full design rationale.

CREATE TABLE post_slug_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_post_slug_history_post_id ON post_slug_history (post_id);

-- Forward FK: posts is defined in posts.sql (loaded after post_slug_history.sql).
ALTER TABLE post_slug_history ADD CONSTRAINT fk_post_slug_history_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
