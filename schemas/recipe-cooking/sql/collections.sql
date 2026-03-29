-- collections: User-curated groups of recipes with optional cover images.
-- See README.md for full design rationale.

CREATE TABLE collections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    description     TEXT,
    cover_image_url TEXT,
    is_public       BOOLEAN NOT NULL DEFAULT false,
    recipe_count    INTEGER NOT NULL DEFAULT 0,
    created_by      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_collections_created_by ON collections (created_by);
