-- recipe_activities: Audit log tracking actions performed on recipes.
-- See README.md for full design rationale.

CREATE TYPE recipe_action AS ENUM (
    'created',
    'updated',
    'published',
    'archived',
    'rated',
    'favorited',
    'added_to_collection',
    'added_to_meal_plan'
);

CREATE TABLE recipe_activities (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id   UUID,
    actor_id    UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    action      recipe_action NOT NULL,
    details     JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recipe_activities_recipe_id ON recipe_activities (recipe_id);
CREATE INDEX idx_recipe_activities_actor_id ON recipe_activities (actor_id);
CREATE INDEX idx_recipe_activities_action ON recipe_activities (action);
CREATE INDEX idx_recipe_activities_occurred_at ON recipe_activities (occurred_at);

-- Forward FK: recipes.sql loads after recipe_activities.sql alphabetically.
ALTER TABLE recipe_activities
    ADD CONSTRAINT fk_recipe_activities_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE SET NULL;
