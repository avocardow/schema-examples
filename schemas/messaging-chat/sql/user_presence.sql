-- user_presence: Tracks each user's current online status and activity.
-- See README.md for full design rationale.

CREATE TYPE presence_status AS ENUM ('online', 'away', 'busy', 'offline');

CREATE TABLE user_presence (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    status             presence_status NOT NULL DEFAULT 'offline',
    status_text        TEXT,
    status_emoji       TEXT,
    last_active_at     TIMESTAMPTZ,
    last_connected_at  TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_presence_status         ON user_presence (status);
CREATE INDEX idx_user_presence_last_active_at ON user_presence (last_active_at);
