-- message_mentions: Tracks @user, @channel, and @all mentions within messages.
-- See README.md for full design rationale.

CREATE TYPE mention_type AS ENUM ('user', 'channel', 'all');

CREATE TABLE message_mentions (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id        UUID        NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    mentioned_user_id UUID        REFERENCES users(id) ON DELETE CASCADE,
    mention_type      mention_type NOT NULL DEFAULT 'user',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_message_mentions_message_user_type UNIQUE (message_id, mentioned_user_id, mention_type)
);

CREATE INDEX idx_message_mentions_mentioned_user_id ON message_mentions (mentioned_user_id);
