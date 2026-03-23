-- post_meta: Extensible key-value metadata store for posts.
-- See README.md for full design rationale.

CREATE TABLE post_meta (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL,
    meta_key        TEXT NOT NULL,
    meta_value      TEXT,

    UNIQUE (post_id, meta_key)
);

CREATE INDEX idx_post_meta_meta_key ON post_meta (meta_key);

-- Forward FK: posts is defined in posts.sql (loaded after post_meta.sql).
ALTER TABLE post_meta ADD CONSTRAINT fk_post_meta_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
