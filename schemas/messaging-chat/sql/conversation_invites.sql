-- conversation_invites: Tracks invitations sent to users to join a conversation.
-- See README.md for full design rationale.

CREATE TYPE conversation_invite_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

CREATE TABLE conversation_invites (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    inviter_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          conversation_invite_status NOT NULL DEFAULT 'pending',
    message         TEXT,
    expires_at      TIMESTAMPTZ,
    responded_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_conversation_invites_conversation_invitee_status
        UNIQUE (conversation_id, invitee_id, status)
);

CREATE INDEX idx_conversation_invites_invitee_status
    ON conversation_invites (invitee_id, status);

CREATE INDEX idx_conversation_invites_conversation_status
    ON conversation_invites (conversation_id, status);

CREATE INDEX idx_conversation_invites_expires_at
    ON conversation_invites (expires_at);
