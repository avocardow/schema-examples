-- item_images: Photos and media attached to auction items.
-- See README.md for full design rationale.

CREATE TABLE item_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id         UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    alt_text        TEXT,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_item_images_item_id ON item_images(item_id);
