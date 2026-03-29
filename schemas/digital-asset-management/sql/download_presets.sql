-- download_presets: Reusable output configurations for asset export and delivery.
-- See README.md for full design rationale.

CREATE TABLE download_presets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL,
    name            TEXT NOT NULL,
    output_format   TEXT,
    max_width       INTEGER,
    max_height      INTEGER,
    quality         INTEGER,
    dpi             INTEGER,
    created_by      UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE download_presets
    ADD CONSTRAINT fk_download_presets_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;

ALTER TABLE download_presets
    ADD CONSTRAINT fk_download_presets_created_by
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT;

CREATE INDEX idx_download_presets_workspace_id ON download_presets (workspace_id);
