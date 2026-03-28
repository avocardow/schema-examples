-- networks: podcast network or publisher that owns and manages one or more shows.
-- See README.md for full design rationale.

CREATE TABLE networks (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT        NOT NULL,
    slug         TEXT        UNIQUE NOT NULL,
    description  TEXT,
    website      TEXT,
    logo_file_id UUID        REFERENCES files(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_networks_name ON networks (name);
