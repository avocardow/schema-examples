-- recipe_nutrition: Per-serving nutritional breakdown for a recipe.
-- See README.md for full design rationale.

CREATE TABLE recipe_nutrition (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id               UUID UNIQUE NOT NULL,
    calories                NUMERIC,
    total_fat_grams         NUMERIC,
    saturated_fat_grams     NUMERIC,
    carbohydrates_grams     NUMERIC,
    fiber_grams             NUMERIC,
    sugar_grams             NUMERIC,
    protein_grams           NUMERIC,
    sodium_mg               NUMERIC,
    cholesterol_mg          NUMERIC,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: recipes.sql loads after recipe_nutrition.sql alphabetically.
ALTER TABLE recipe_nutrition
    ADD CONSTRAINT fk_recipe_nutrition_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;
