-- meal_plan_entries: Individual recipe slots within a meal plan.
-- See README.md for full design rationale.

CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

CREATE TABLE meal_plan_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id    UUID NOT NULL REFERENCES meal_plans (id) ON DELETE CASCADE,
    recipe_id       UUID NOT NULL,
    plan_date       TEXT NOT NULL,
    meal_type       meal_type NOT NULL,
    servings        INTEGER,
    note            TEXT
);

CREATE INDEX idx_meal_plan_entries_meal_plan_id_plan_date ON meal_plan_entries (meal_plan_id, plan_date);
CREATE INDEX idx_meal_plan_entries_recipe_id ON meal_plan_entries (recipe_id);

-- Forward FK: recipes.sql loads after meal_plan_entries.sql alphabetically.
ALTER TABLE meal_plan_entries
    ADD CONSTRAINT fk_meal_plan_entries_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;
