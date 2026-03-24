-- task_labels: Junction table associating tasks with labels for categorization.
-- See README.md for full design rationale.

CREATE TABLE task_labels (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL,
  label_id   UUID NOT NULL REFERENCES labels (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (task_id, label_id)
);

CREATE INDEX idx_task_labels_label ON task_labels (label_id);

-- Forward FK: tasks loads after this file alphabetically.
ALTER TABLE task_labels
  ADD CONSTRAINT fk_task_labels_task
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;
