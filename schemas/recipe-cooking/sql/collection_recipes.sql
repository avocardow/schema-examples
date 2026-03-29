-- collection_recipes: Junction table linking recipes to user collections.
-- See README.md for full design rationale.

CREATE TABLE collection_recipes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id   UUID NOT NULL REFERENCES collections (id) ON DELETE CASCADE,
    recipe_id       UUID NOT NULL,
    position        INTEGER NOT NULL DEFAULT 0,
    added_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (collection_id, recipe_id)
);

CREATE INDEX idx_collection_recipes_recipe_id ON collection_recipes (recipe_id);

-- Forward FK: recipes.sql loads after collection_recipes.sql alphabetically.
ALTER TABLE collection_recipes
    ADD CONSTRAINT fk_collection_recipes_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;
