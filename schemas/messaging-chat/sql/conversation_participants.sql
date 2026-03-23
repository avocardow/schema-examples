-- conversation_participants: Links users to conversations with role, mute, and read-tracking metadata.
-- See README.md for full design rationale.

CREATE TYPE conversation_participant_role AS ENUM ('owner', 'admin', 'moderator', 'member');
CREATE TYPE conversation_notification_level AS ENUM ('all', 'mentions', 'none');

CREATE TABLE conversation_participants (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id    UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role               conversation_participant_role NOT NULL DEFAULT 'member',
    last_read_at       TIMESTAMPTZ,
    notification_level conversation_notification_level,
    is_muted           BOOLEAN     NOT NULL DEFAULT FALSE,
    muted_until        TIMESTAMPTZ,
    joined_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_conversation_participants_conversation_user UNIQUE (conversation_id, user_id)
);

CREATE INDEX idx_conversation_participants_user_id
    ON conversation_participants (user_id);

CREATE INDEX idx_conversation_participants_user_id_last_read_at
    ON conversation_participants (user_id, last_read_at);
