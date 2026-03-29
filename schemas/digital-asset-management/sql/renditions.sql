-- renditions: Pre-generated derivative formats of an asset for fast delivery.
-- See README.md for full design rationale.

CREATE TABLE renditions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id    UUID NOT NULL REFERENCES assets (id) ON DELETE CASCADE,
    preset_name TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    mime_type   TEXT NOT NULL,
    file_size   BIGINT NOT NULL,
    width       INTEGER,
    height      INTEGER,
    format      TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (asset_id, preset_name)
);
