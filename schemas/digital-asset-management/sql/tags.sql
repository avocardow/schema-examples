-- tags: Workspace-scoped labels for flexible asset classification.
-- See README.md for full design rationale.

CREATE TABLE tags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL,
    name            TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (workspace_id, name)
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE tags
    ADD CONSTRAINT fk_tags_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;
