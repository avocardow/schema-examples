-- task_attachments: Files and documents uploaded to tasks.
-- See README.md for full design rationale.

CREATE TABLE task_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID NOT NULL,
  uploaded_by UUID REFERENCES users (id) ON DELETE SET NULL,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_size   INTEGER,
  mime_type   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_attachments_task ON task_attachments (task_id);
CREATE INDEX idx_task_attachments_uploaded_by ON task_attachments (uploaded_by);

-- Forward FK: tasks loads after this file alphabetically.
ALTER TABLE task_attachments
  ADD CONSTRAINT fk_task_attachments_task
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;
