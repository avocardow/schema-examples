-- shopping_lists: Grocery lists optionally linked to a meal plan.
-- See README.md for full design rationale.

CREATE TABLE shopping_lists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    meal_plan_id    UUID REFERENCES meal_plans (id) ON DELETE SET NULL,
    created_by      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shopping_lists_created_by ON shopping_lists (created_by);
CREATE INDEX idx_shopping_lists_meal_plan_id ON shopping_lists (meal_plan_id);
