-- recipe_favorites: Tracks which recipes users have bookmarked.
-- See README.md for full design rationale.

CREATE TABLE recipe_favorites (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id   UUID NOT NULL,
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (recipe_id, user_id)
);

CREATE INDEX idx_recipe_favorites_user_id ON recipe_favorites (user_id);

-- Forward FK: recipes.sql loads after recipe_favorites.sql alphabetically.
ALTER TABLE recipe_favorites
    ADD CONSTRAINT fk_recipe_favorites_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;
