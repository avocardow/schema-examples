-- authors: Author profiles linked to user accounts.
-- See README.md for full design rationale.

CREATE TABLE authors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name    TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    bio             TEXT,
    avatar_url      TEXT,
    website_url     TEXT,
    social_links    JSONB DEFAULT '{}'::jsonb,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
