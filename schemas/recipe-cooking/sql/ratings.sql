-- ratings: User scores and optional reviews for recipes.
-- See README.md for full design rationale.

CREATE TABLE ratings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id   UUID NOT NULL,
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    score       INTEGER NOT NULL,
    review      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (recipe_id, user_id)
);

CREATE INDEX idx_ratings_user_id ON ratings (user_id);

-- Forward FK: recipes.sql loads after ratings.sql alphabetically.
ALTER TABLE ratings
    ADD CONSTRAINT fk_ratings_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;
