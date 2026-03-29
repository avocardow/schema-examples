-- metadata_values: Stores the actual custom metadata values assigned to each asset.
-- See README.md for full design rationale.

CREATE TABLE metadata_values (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id    UUID NOT NULL REFERENCES assets (id) ON DELETE CASCADE,
    schema_id   UUID NOT NULL REFERENCES metadata_schemas (id) ON DELETE CASCADE,
    value       TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (asset_id, schema_id)
);

CREATE INDEX idx_metadata_values_schema_id ON metadata_values (schema_id);
