-- task_comments: Threaded discussion on tasks with support for nested replies.
-- See README.md for full design rationale.

CREATE TABLE task_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL,
  user_id    UUID REFERENCES users (id) ON DELETE SET NULL,
  parent_id  UUID REFERENCES task_comments (id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_comments_task ON task_comments (task_id);
CREATE INDEX idx_task_comments_parent ON task_comments (parent_id);
CREATE INDEX idx_task_comments_user ON task_comments (user_id);

-- Forward FK: tasks loads after this file alphabetically.
ALTER TABLE task_comments
  ADD CONSTRAINT fk_task_comments_task
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;
