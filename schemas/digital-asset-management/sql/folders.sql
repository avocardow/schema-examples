-- folders: Hierarchical directory structure for organising assets within a workspace.
-- See README.md for full design rationale.

CREATE TABLE folders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL,
    parent_id       UUID REFERENCES folders (id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    path            TEXT NOT NULL,
    depth           INTEGER NOT NULL DEFAULT 0,
    description     TEXT,
    created_by      UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE folders
    ADD CONSTRAINT fk_folders_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;

ALTER TABLE folders
    ADD CONSTRAINT fk_folders_created_by
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT;

ALTER TABLE folders
    ADD CONSTRAINT uq_folders_workspace_path
    UNIQUE (workspace_id, path);

ALTER TABLE folders
    ADD CONSTRAINT uq_folders_workspace_parent_name
    UNIQUE (workspace_id, parent_id, name);

CREATE INDEX idx_folders_parent_id ON folders (parent_id);
CREATE INDEX idx_folders_workspace_depth ON folders (workspace_id, depth);
