-- series_items: Ordered membership of posts within a content series.
-- See README.md for full design rationale.

CREATE TABLE series_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id       UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    post_id         UUID NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,

    UNIQUE (series_id, post_id)
);

CREATE INDEX idx_series_items_post_id ON series_items (post_id);
CREATE INDEX idx_series_items_series_id_sort_order ON series_items (series_id, sort_order);

-- Forward FK: posts is defined in posts.sql (loaded after series_items.sql).
ALTER TABLE series_items ADD CONSTRAINT fk_series_items_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
