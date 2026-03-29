-- workspaces: Top-level organisational unit that owns all assets and settings.
-- See README.md for full design rationale.

CREATE TABLE workspaces (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    description         TEXT,
    logo_url            TEXT,
    storage_limit_bytes BIGINT,
    storage_used_bytes  BIGINT NOT NULL DEFAULT 0,
    created_by          UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
