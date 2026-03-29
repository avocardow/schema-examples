-- assets: Central entity representing a managed digital file and its metadata.
-- See README.md for full design rationale.

CREATE TYPE asset_type AS ENUM (
    'image',
    'video',
    'audio',
    'document',
    'font',
    'archive',
    'other'
);

CREATE TYPE asset_status AS ENUM (
    'draft',
    'active',
    'archived',
    'expired'
);

CREATE TABLE assets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID NOT NULL,
    folder_id           UUID,
    name                TEXT NOT NULL,
    original_filename   TEXT NOT NULL,
    description         TEXT,
    storage_key         TEXT UNIQUE NOT NULL,
    mime_type           TEXT NOT NULL,
    file_size           BIGINT NOT NULL,
    file_extension      TEXT NOT NULL,
    asset_type          asset_type NOT NULL,
    status              asset_status NOT NULL DEFAULT 'draft',
    current_version_id  UUID,
    version_count       INTEGER NOT NULL DEFAULT 1,
    width               INTEGER,
    height              INTEGER,
    duration_seconds    NUMERIC,
    color_space         TEXT,
    dpi                 INTEGER,
    uploaded_by         UUID NOT NULL,
    checksum_sha256     TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE assets
    ADD CONSTRAINT fk_assets_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;

-- Forward FK: folders is defined in folders.sql (loaded after this file).
ALTER TABLE assets
    ADD CONSTRAINT fk_assets_folder
    FOREIGN KEY (folder_id) REFERENCES folders (id) ON DELETE SET NULL;

ALTER TABLE assets
    ADD CONSTRAINT fk_assets_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE RESTRICT;

-- Circular FK: asset_versions.asset_id → assets.id is handled in asset_versions.sql.
ALTER TABLE assets
    ADD CONSTRAINT fk_assets_current_version
    FOREIGN KEY (current_version_id) REFERENCES asset_versions (id) ON DELETE SET NULL;

CREATE INDEX idx_assets_workspace_folder ON assets (workspace_id, folder_id);
CREATE INDEX idx_assets_workspace_type ON assets (workspace_id, asset_type);
CREATE INDEX idx_assets_workspace_status ON assets (workspace_id, status);
CREATE INDEX idx_assets_uploaded_by ON assets (uploaded_by);
CREATE INDEX idx_assets_mime_type ON assets (mime_type);
