-- custom_fields: Configurable intake form fields attached to specific services.
-- See README.md for full design rationale.

CREATE TYPE custom_field_type AS ENUM ('text', 'textarea', 'select', 'multi_select', 'checkbox', 'number', 'date', 'phone', 'email');

CREATE TABLE custom_fields (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      UUID NOT NULL,
  label           TEXT NOT NULL,
  field_type      custom_field_type NOT NULL,
  placeholder     TEXT,
  is_required     BOOLEAN NOT NULL DEFAULT FALSE,
  options         JSONB,
  position        INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_fields_service_id_position ON custom_fields (service_id, position);

-- Forward FK: services loads after this file alphabetically.
ALTER TABLE custom_fields
  ADD CONSTRAINT fk_custom_fields_service
  FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE;
