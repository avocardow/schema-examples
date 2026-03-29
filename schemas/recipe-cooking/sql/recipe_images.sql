-- recipe_images: Photos and visual assets associated with a recipe.
-- See README.md for full design rationale.

CREATE TABLE recipe_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id   UUID NOT NULL,
    image_url   TEXT NOT NULL,
    caption     TEXT,
    is_primary  BOOLEAN NOT NULL DEFAULT false,
    position    INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recipe_images_recipe_id_position ON recipe_images (recipe_id, position);

-- Forward FK: recipes.sql loads after recipe_images.sql alphabetically.
ALTER TABLE recipe_images
    ADD CONSTRAINT fk_recipe_images_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;
