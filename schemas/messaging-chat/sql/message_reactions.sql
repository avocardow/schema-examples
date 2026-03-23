-- message_reactions: Stores emoji reactions by users on messages.
-- See README.md for full design rationale.

CREATE TABLE message_reactions (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id  UUID        NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji       TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_message_reactions_message_user_emoji UNIQUE (message_id, user_id, emoji)
);

CREATE INDEX idx_message_reactions_user_id ON message_reactions (user_id);
