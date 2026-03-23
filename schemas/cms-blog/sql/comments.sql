-- comments: Threaded reader comments on posts with moderation support.
-- See README.md for full design rationale.

CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected', 'spam');

CREATE TABLE comments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL,
    parent_id       UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name     TEXT NOT NULL,
    author_email    TEXT,
    content         TEXT NOT NULL,
    status          comment_status NOT NULL DEFAULT 'pending',
    ip_address      TEXT,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id_status_created_at ON comments (post_id, status, created_at);
CREATE INDEX idx_comments_parent_id ON comments (parent_id);
CREATE INDEX idx_comments_author_id ON comments (author_id);

-- Forward FK: posts is defined in posts.sql (loaded after comments.sql).
ALTER TABLE comments ADD CONSTRAINT fk_comments_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
