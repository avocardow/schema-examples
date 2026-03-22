-- file_tag_assignments: Many-to-many join between files and tags with audit trail.
-- See README.md for full design rationale and field documentation.

CREATE TABLE file_tag_assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id         UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
                                                   -- The tagged file.
                                                   -- Cascade: deleting a file removes all its tag assignments.
  tag_id          UUID NOT NULL REFERENCES file_tags(id) ON DELETE CASCADE,
                                                   -- The applied tag.
                                                   -- Cascade: deleting a tag removes all its assignments.
  tagged_by       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                   -- Who applied this tag to this file.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (file_id, tag_id)                         -- A tag can only be applied once per file.
);

CREATE INDEX idx_file_tag_assignments_tag_id ON file_tag_assignments (tag_id);
CREATE INDEX idx_file_tag_assignments_tagged_by ON file_tag_assignments (tagged_by);
