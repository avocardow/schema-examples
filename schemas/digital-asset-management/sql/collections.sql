-- collections: Curated groups of assets for organising and sharing themed sets.
-- See README.md for full design rationale.

CREATE TABLE collections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    cover_asset_id  UUID REFERENCES assets (id) ON DELETE SET NULL,
    is_public       BOOLEAN NOT NULL DEFAULT false,
    asset_count     INTEGER NOT NULL DEFAULT 0,
    created_by      UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE collections
    ADD CONSTRAINT fk_collections_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;

ALTER TABLE collections
    ADD CONSTRAINT fk_collections_created_by
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT;

CREATE INDEX idx_collections_workspace_id ON collections (workspace_id);
CREATE INDEX idx_collections_created_by ON collections (created_by);
