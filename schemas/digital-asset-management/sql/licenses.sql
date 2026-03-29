-- licenses: Defines reusable license templates governing asset usage rights.
-- See README.md for full design rationale.

CREATE TYPE license_type AS ENUM (
    'royalty_free',
    'rights_managed',
    'editorial',
    'creative_commons',
    'internal',
    'custom'
);

CREATE TABLE licenses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    license_type    license_type NOT NULL,
    territories     JSONB,
    channels        JSONB,
    max_uses        INTEGER,
    created_by      UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE licenses
    ADD CONSTRAINT fk_licenses_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;

ALTER TABLE licenses
    ADD CONSTRAINT fk_licenses_created_by
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT;

CREATE INDEX idx_licenses_workspace_id ON licenses (workspace_id);
CREATE INDEX idx_licenses_license_type ON licenses (license_type);
