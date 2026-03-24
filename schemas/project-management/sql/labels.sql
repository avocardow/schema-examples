-- labels: Color-coded tags for categorizing and filtering tasks within a project.
-- See README.md for full design rationale.

CREATE TABLE labels (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL,
  name        TEXT NOT NULL,
  color       TEXT,
  description TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (project_id, name)
);

-- Forward FK: projects loads after this file alphabetically.
ALTER TABLE labels
  ADD CONSTRAINT fk_labels_project
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;
