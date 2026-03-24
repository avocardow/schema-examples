-- custom_field_values: Stores the value of a custom field for a specific task.
-- See README.md for full design rationale.

CREATE TABLE custom_field_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id         UUID NOT NULL,
  custom_field_id UUID NOT NULL REFERENCES custom_fields (id) ON DELETE CASCADE,
  value           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (task_id, custom_field_id)
);

CREATE INDEX idx_custom_field_values_custom_field ON custom_field_values (custom_field_id);

-- Forward FK: tasks loads after this file alphabetically.
ALTER TABLE custom_field_values
  ADD CONSTRAINT fk_custom_field_values_task
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;
