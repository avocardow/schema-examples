-- posts: User-authored content supporting replies, quotes, and threaded conversations.
-- See README.md for full design rationale and field documentation.

CREATE TYPE post_content_type AS ENUM ('text', 'system', 'deleted');
CREATE TYPE post_visibility AS ENUM ('public', 'unlisted', 'followers_only', 'mentioned_only');

CREATE TABLE posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  content         TEXT,
  content_type    post_content_type NOT NULL DEFAULT 'text',
  reply_to_id     UUID REFERENCES posts (id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES posts (id) ON DELETE SET NULL,
  quote_of_id     UUID REFERENCES posts (id) ON DELETE SET NULL,
  visibility      post_visibility NOT NULL DEFAULT 'public',
  is_edited       BOOLEAN NOT NULL DEFAULT FALSE,
  edited_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  reply_count     INTEGER NOT NULL DEFAULT 0,
  reaction_count  INTEGER NOT NULL DEFAULT 0,
  repost_count    INTEGER NOT NULL DEFAULT 0,
  poll_id         UUID REFERENCES polls (id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_author_id_created_at ON posts (author_id, created_at);
CREATE INDEX idx_posts_reply_to_id ON posts (reply_to_id);
CREATE INDEX idx_posts_conversation_id_created_at ON posts (conversation_id, created_at);
CREATE INDEX idx_posts_visibility_created_at ON posts (visibility, created_at);
CREATE INDEX idx_posts_expires_at ON posts (expires_at);
CREATE INDEX idx_posts_quote_of_id ON posts (quote_of_id);
