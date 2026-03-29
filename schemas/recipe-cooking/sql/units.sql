-- units: Measurement units used in recipe ingredients and shopping lists.
-- See README.md for full design rationale.

CREATE TYPE unit_system AS ENUM ('metric', 'imperial', 'universal');

CREATE TABLE units (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT UNIQUE NOT NULL,
    abbreviation    TEXT,
    system          unit_system
);
