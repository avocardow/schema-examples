-- comments: Threaded discussion on assets for review and collaboration.
-- See README.md for full design rationale.

CREATE TABLE comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id    UUID NOT NULL REFERENCES assets (id) ON DELETE CASCADE,
    parent_id   UUID REFERENCES comments (id) ON DELETE CASCADE,
    body        TEXT NOT NULL,
    author_id   UUID NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE comments
    ADD CONSTRAINT fk_comments_author
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE;

CREATE INDEX idx_comments_asset_id ON comments (asset_id);
CREATE INDEX idx_comments_parent_id ON comments (parent_id);
