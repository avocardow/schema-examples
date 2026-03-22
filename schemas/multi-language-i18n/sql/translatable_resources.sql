-- translatable_resources: Registry of entity types whose fields support content translation.
-- See README.md for full design rationale.

CREATE TABLE translatable_resources (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type       TEXT UNIQUE NOT NULL,
  display_name        TEXT NOT NULL,
  translatable_fields JSONB NOT NULL,
  description         TEXT,
  is_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
