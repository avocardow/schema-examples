-- comment_votes: User upvotes and downvotes on comments.
-- See README.md for full design rationale.

CREATE TABLE comment_votes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id      UUID NOT NULL,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    value           INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (comment_id, user_id)
);

CREATE INDEX idx_comment_votes_user_id ON comment_votes (user_id);

-- Forward FK: comments is defined in comments.sql (loaded after comment_votes.sql).
ALTER TABLE comment_votes ADD CONSTRAINT fk_comment_votes_comment_id
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE;
