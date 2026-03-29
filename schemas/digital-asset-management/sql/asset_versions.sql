-- asset_versions: Immutable record of each version of an asset's file.
-- See README.md for full design rationale.

CREATE TABLE asset_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id        UUID NOT NULL,
    version_number  INTEGER NOT NULL,
    storage_key     TEXT NOT NULL,
    mime_type       TEXT NOT NULL,
    file_size       BIGINT NOT NULL,
    file_extension  TEXT NOT NULL,
    checksum_sha256 TEXT,
    change_summary  TEXT,
    created_by      UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (asset_id, version_number)
);

-- Forward FK: assets is defined in assets.sql (loaded after this file).
ALTER TABLE asset_versions
    ADD CONSTRAINT fk_asset_versions_asset
    FOREIGN KEY (asset_id) REFERENCES assets (id) ON DELETE CASCADE;

ALTER TABLE asset_versions
    ADD CONSTRAINT fk_asset_versions_created_by
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT;
