-- post_reactions: Emoji-style reactions from users on posts.
-- See README.md for full design rationale.

CREATE TYPE reaction_type AS ENUM ('like', 'love', 'clap', 'insightful', 'bookmark');

CREATE TABLE post_reactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type   reaction_type NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (post_id, user_id, reaction_type)
);

CREATE INDEX idx_post_reactions_user_id ON post_reactions (user_id);
CREATE INDEX idx_post_reactions_post_id_reaction_type ON post_reactions (post_id, reaction_type);

-- Forward FK: posts is defined in posts.sql (loaded after post_reactions.sql).
ALTER TABLE post_reactions ADD CONSTRAINT fk_post_reactions_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
