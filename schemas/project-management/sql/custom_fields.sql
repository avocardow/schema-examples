-- custom_fields: User-defined fields that extend task data with project-specific attributes.
-- See README.md for full design rationale.

CREATE TYPE custom_field_type AS ENUM ('text', 'number', 'date', 'select', 'multi_select', 'checkbox', 'url');

CREATE TABLE custom_fields (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL,
  name        TEXT NOT NULL,
  field_type  custom_field_type NOT NULL,
  description TEXT,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_fields_project_position ON custom_fields (project_id, position);

-- Forward FK: projects loads after this file alphabetically.
ALTER TABLE custom_fields
  ADD CONSTRAINT fk_custom_fields_project
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;
