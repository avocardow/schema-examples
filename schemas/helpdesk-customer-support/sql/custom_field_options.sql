-- custom_field_options: Selectable options for dropdown/multi-select custom fields.
-- See README.md for full design rationale.

CREATE TABLE custom_field_options (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_field_id UUID NOT NULL REFERENCES custom_fields (id) ON DELETE CASCADE,
  label           TEXT NOT NULL,
  value           TEXT NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_custom_field_options_custom_field_id_sort_order ON custom_field_options (custom_field_id, sort_order);
