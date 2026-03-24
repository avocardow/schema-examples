-- custom_field_options: Predefined choices for select/multi-select custom fields.
-- See README.md for full design rationale.

CREATE TABLE custom_field_options (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_field_id UUID NOT NULL REFERENCES custom_fields (id) ON DELETE CASCADE,
  value           TEXT NOT NULL,
  color           TEXT,
  position        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_field_options_field_pos ON custom_field_options (custom_field_id, position);
