-- custom_field_values: Stored values for custom fields on specific entities.
-- See README.md for full design rationale.

CREATE TABLE custom_field_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_field_id UUID NOT NULL REFERENCES custom_fields (id) ON DELETE CASCADE,
  entity_id       UUID NOT NULL,
  value           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (custom_field_id, entity_id)
);

CREATE INDEX idx_custom_field_values_entity_id ON custom_field_values (entity_id);
