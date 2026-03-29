-- foods: Canonical ingredient catalog with optional categorization.
-- See README.md for full design rationale.

CREATE TABLE foods (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT UNIQUE NOT NULL,
    category    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_foods_category ON foods (category);
