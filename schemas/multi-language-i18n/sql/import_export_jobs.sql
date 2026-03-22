-- import_export_jobs: Tracks bulk import/export operations with progress and error reporting.
-- See README.md for full design rationale.

CREATE TYPE import_export_type AS ENUM ('import', 'export');
CREATE TYPE import_export_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE import_export_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            import_export_type NOT NULL,
  format          TEXT NOT NULL,
  status          import_export_status NOT NULL DEFAULT 'pending',
  locale_id       UUID REFERENCES locales(id) ON DELETE SET NULL,
  namespace_id    UUID REFERENCES namespaces(id) ON DELETE SET NULL,
  file_path       TEXT,
  total_count     INTEGER NOT NULL DEFAULT 0,
  processed_count INTEGER NOT NULL DEFAULT 0,
  error_message   TEXT,
  options         JSONB,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_import_export_jobs_status ON import_export_jobs (status);
CREATE INDEX idx_import_export_jobs_created_by ON import_export_jobs (created_by);
CREATE INDEX idx_import_export_jobs_type_status ON import_export_jobs (type, status);
