-- collection_assets: Many-to-many join linking assets into ordered collections.
-- See README.md for full design rationale.

CREATE TABLE collection_assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id   UUID NOT NULL,
    asset_id        UUID NOT NULL REFERENCES assets (id) ON DELETE CASCADE,
    position        INTEGER NOT NULL DEFAULT 0,
    added_by        UUID NOT NULL,
    added_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (collection_id, asset_id)
);

-- Forward FK: collections is defined in collections.sql (loaded after this file).
ALTER TABLE collection_assets
    ADD CONSTRAINT fk_collection_assets_collection
    FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE;

ALTER TABLE collection_assets
    ADD CONSTRAINT fk_collection_assets_added_by
    FOREIGN KEY (added_by) REFERENCES users (id) ON DELETE RESTRICT;

CREATE INDEX idx_collection_assets_asset_id ON collection_assets (asset_id);
