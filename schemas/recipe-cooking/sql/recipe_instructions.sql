-- recipe_instructions: Ordered preparation steps for a recipe.
-- See README.md for full design rationale.

CREATE TABLE recipe_instructions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id       UUID NOT NULL,
    step_number     INTEGER NOT NULL,
    instruction     TEXT NOT NULL,
    section_label   TEXT,
    time_minutes    INTEGER,
    UNIQUE (recipe_id, step_number)
);

-- Forward FK: recipes.sql loads after recipe_instructions.sql alphabetically.
ALTER TABLE recipe_instructions
    ADD CONSTRAINT fk_recipe_instructions_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;
