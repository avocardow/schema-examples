-- people: Individuals (hosts, guests, contributors) associated with podcast content.
-- See README.md for full design rationale.

CREATE TABLE people (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    slug              TEXT UNIQUE NOT NULL,
    bio               TEXT,
    url               TEXT,
    image_file_id     UUID REFERENCES files(id) ON DELETE SET NULL,
    podcast_index_id  TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_people_name ON people (name);
