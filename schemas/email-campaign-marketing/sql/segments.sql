-- segments: Dynamic contact groups defined by filter criteria for targeting.
-- See README.md for full design rationale.

CREATE TABLE segments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    description     TEXT,
    filter_criteria JSONB NOT NULL,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_segments_created_by ON segments (created_by);
