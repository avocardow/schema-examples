-- metadata_schemas: Defines custom metadata fields available per workspace.
-- See README.md for full design rationale.

CREATE TYPE metadata_field_type AS ENUM (
    'text',
    'number',
    'date',
    'boolean',
    'single_select',
    'multi_select'
);

CREATE TABLE metadata_schemas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL,
    field_name      TEXT NOT NULL,
    field_label     TEXT NOT NULL,
    field_type      metadata_field_type NOT NULL,
    options         JSONB,
    is_required     BOOLEAN NOT NULL DEFAULT false,
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (workspace_id, field_name)
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE metadata_schemas
    ADD CONSTRAINT fk_metadata_schemas_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;
