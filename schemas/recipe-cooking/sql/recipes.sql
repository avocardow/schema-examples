-- recipes: Core table storing recipe metadata and authorship.
-- See README.md for full design rationale.

CREATE TYPE recipe_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE recipe_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE recipes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    description         TEXT,
    source_url          TEXT,
    source_name         TEXT,
    servings            TEXT,
    prep_time_minutes   INTEGER,
    cook_time_minutes   INTEGER,
    total_time_minutes  INTEGER,
    difficulty          recipe_difficulty,
    status              recipe_status NOT NULL DEFAULT 'draft',
    language            TEXT,
    created_by          UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recipes_created_by ON recipes (created_by);
CREATE INDEX idx_recipes_status ON recipes (status);
CREATE INDEX idx_recipes_difficulty ON recipes (difficulty);
