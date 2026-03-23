-- post_revisions: Versioned snapshots of post content for history and rollback.
-- See README.md for full design rationale.

CREATE TABLE post_revisions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL,
    revision_number INTEGER NOT NULL,
    title           TEXT NOT NULL,
    content         TEXT,
    excerpt         TEXT,
    created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (post_id, revision_number)
);

CREATE INDEX idx_post_revisions_post_id_created_at ON post_revisions (post_id, created_at);

-- Forward FK: posts is defined in posts.sql (loaded after post_revisions.sql).
ALTER TABLE post_revisions ADD CONSTRAINT fk_post_revisions_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
