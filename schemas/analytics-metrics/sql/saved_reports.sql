-- saved_reports: User-created report configurations with visibility controls.
-- See README.md for full design rationale.

CREATE TYPE report_visibility AS ENUM ('private', 'team', 'public');

CREATE TABLE saved_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  config        JSONB NOT NULL,
  visibility    report_visibility NOT NULL DEFAULT 'private',
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_reports_created_by ON saved_reports (created_by);
CREATE INDEX idx_saved_reports_visibility ON saved_reports (visibility);
