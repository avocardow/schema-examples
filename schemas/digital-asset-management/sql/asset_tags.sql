-- asset_tags: Many-to-many join between assets and tags for categorisation.
-- See README.md for full design rationale.

CREATE TABLE asset_tags (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id      UUID NOT NULL,
    tag_id        UUID NOT NULL,
    assigned_by   UUID NOT NULL,
    assigned_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (asset_id, tag_id)
);

-- Forward FK: assets is defined in assets.sql (loaded after this file).
ALTER TABLE asset_tags
    ADD CONSTRAINT fk_asset_tags_asset
    FOREIGN KEY (asset_id) REFERENCES assets (id) ON DELETE CASCADE;

-- Forward FK: tags is defined in tags.sql (loaded after this file).
ALTER TABLE asset_tags
    ADD CONSTRAINT fk_asset_tags_tag
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE;

ALTER TABLE asset_tags
    ADD CONSTRAINT fk_asset_tags_assigned_by
    FOREIGN KEY (assigned_by) REFERENCES users (id) ON DELETE RESTRICT;

CREATE INDEX idx_asset_tags_tag_id ON asset_tags (tag_id);
