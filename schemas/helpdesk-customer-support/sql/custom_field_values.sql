-- custom_field_values: Stored values for custom fields on individual tickets.
-- See README.md for full design rationale.

CREATE TABLE custom_field_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_field_id UUID NOT NULL REFERENCES custom_fields (id) ON DELETE CASCADE,
  ticket_id       UUID NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
  value           TEXT,
  UNIQUE (custom_field_id, ticket_id)
);

CREATE INDEX idx_custom_field_values_ticket_id ON custom_field_values (ticket_id);
