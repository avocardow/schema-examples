-- file_metadata_fields: Custom metadata field definitions with type information for application-level validation.
-- See README.md for full design rationale and field documentation.

CREATE TYPE file_metadata_field_type AS ENUM (
  'string',
  'integer',
  'float',
  'boolean',
  'date',
  'url',
  'select'
);

CREATE TABLE file_metadata_fields (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT UNIQUE NOT NULL,              -- Machine-readable key (e.g., "invoice_number", "project_code").
  label           TEXT NOT NULL,                     -- Human-readable display name (e.g., "Invoice Number", "Project Code").

  -- Determines validation rules applied at the application layer.
  -- string = free text. integer/float = numeric validation. boolean = true/false.
  -- date = ISO 8601 date string. url = URL format validation. select = must match an options[] value.
  field_type      file_metadata_field_type NOT NULL,

  description     TEXT,                              -- Explain what this field is for or how to fill it in.

  -- If true, every file must have a value for this field.
  -- Enforced at the application layer, not as a DB constraint.
  is_required     BOOLEAN NOT NULL DEFAULT FALSE,

  default_value   TEXT,                              -- Default value for new files. Stored as text, same as values.

  -- For select-type fields: array of valid values.
  -- e.g., ["low", "medium", "high"] or ["draft", "final", "archived"].
  -- Null for non-select types.
  options         JSONB,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
