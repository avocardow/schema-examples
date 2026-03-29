-- recipe_ingredients: Individual ingredient lines within a recipe.
-- See README.md for full design rationale.

CREATE TABLE recipe_ingredients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id       UUID NOT NULL,
    food_id         UUID NOT NULL REFERENCES foods (id) ON DELETE RESTRICT,
    unit_id         UUID,
    quantity        NUMERIC,
    note            TEXT,
    section_label   TEXT,
    position        INTEGER NOT NULL DEFAULT 0,
    optional        BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_recipe_ingredients_recipe_id_position ON recipe_ingredients (recipe_id, position);
CREATE INDEX idx_recipe_ingredients_food_id ON recipe_ingredients (food_id);

-- Forward FK: recipes.sql loads after recipe_ingredients.sql alphabetically.
ALTER TABLE recipe_ingredients
    ADD CONSTRAINT fk_recipe_ingredients_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;

-- Forward FK: units.sql loads after recipe_ingredients.sql alphabetically.
ALTER TABLE recipe_ingredients
    ADD CONSTRAINT fk_recipe_ingredients_unit
    FOREIGN KEY (unit_id) REFERENCES units (id) ON DELETE SET NULL;
