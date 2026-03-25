-- custom_fields: User-defined field definitions for extending tickets with custom data.
-- See README.md for full design rationale.

CREATE TYPE custom_field_type AS ENUM (
  'text', 'number', 'date', 'dropdown', 'checkbox', 'textarea', 'url', 'email'
);

CREATE TABLE custom_fields (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  label       TEXT NOT NULL,
  field_type  custom_field_type NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_fields_sort_order ON custom_fields (sort_order);
