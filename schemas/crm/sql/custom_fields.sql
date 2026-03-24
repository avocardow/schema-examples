-- custom_fields: User-defined field definitions scoped to an entity type.
-- See README.md for full design rationale.

CREATE TYPE custom_field_entity_type AS ENUM ('contact', 'company', 'deal', 'lead');

CREATE TYPE custom_field_type AS ENUM (
  'text', 'number', 'date', 'select', 'multi_select', 'checkbox', 'url'
);

CREATE TABLE custom_fields (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type custom_field_entity_type NOT NULL,
  name        TEXT NOT NULL,
  field_type  custom_field_type NOT NULL,
  description TEXT,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_fields_entity_pos ON custom_fields (entity_type, position);
