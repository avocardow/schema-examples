-- custom_field_options: Predefined choices for select and multi-select custom fields.
-- See README.md for full design rationale.

CREATE TABLE custom_field_options (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_field_id UUID NOT NULL,
  value           TEXT NOT NULL,
  color           TEXT,
  position        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_field_options_field_position ON custom_field_options (custom_field_id, position);

-- Forward FK: custom_fields is defined in custom_fields.sql (loaded after this file).
ALTER TABLE custom_field_options
  ADD CONSTRAINT fk_custom_field_options_custom_field
  FOREIGN KEY (custom_field_id) REFERENCES custom_fields (id) ON DELETE CASCADE;
