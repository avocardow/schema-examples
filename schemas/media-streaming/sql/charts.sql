-- charts: Curated or algorithmic music charts (e.g., Top 50, Viral).
-- See README.md for full design rationale.

CREATE TYPE chart_type AS ENUM ('top', 'viral', 'new_releases', 'trending');

CREATE TABLE charts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    description TEXT,
    chart_type  chart_type NOT NULL,
    region      TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_charts_chart_type_region ON charts (chart_type, region);
CREATE INDEX idx_charts_is_active ON charts (is_active);
