-- file_metadata_values: Custom metadata values per file — each row stores one field's value for one file.
-- See README.md for full design rationale and field documentation.

CREATE TABLE file_metadata_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id         UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
                                                 -- The file this metadata belongs to.
                                                 -- Cascade: deleting a file removes all its metadata values.
  field_id        UUID NOT NULL REFERENCES file_metadata_fields(id) ON DELETE CASCADE,
                                                 -- Which metadata field this value is for.
                                                 -- Cascade: deleting a field definition removes all its values.

  -- The actual value, stored as text regardless of field_type.
  -- Application validates against field_type before saving.
  -- Nullable: a value row with null means "explicitly empty".
  value           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One value per field per file.
CREATE UNIQUE INDEX uq_file_metadata_values_file_id_field_id ON file_metadata_values (file_id, field_id);

-- "All files where invoice_number = 'INV-2024-001'."
CREATE INDEX idx_file_metadata_values_field_id_value ON file_metadata_values (field_id, value);
