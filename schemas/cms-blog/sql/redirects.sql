-- redirects: URL redirect rules for SEO preservation with configurable HTTP status codes.
-- See README.md for full design rationale.

CREATE TABLE redirects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_path     TEXT NOT NULL UNIQUE,
    target_path     TEXT NOT NULL,
    status_code     INTEGER NOT NULL DEFAULT 301,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_redirects_is_active ON redirects (is_active);
