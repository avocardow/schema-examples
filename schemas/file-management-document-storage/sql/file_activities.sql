-- file_activities: Audit trail for file and folder operations. Append-only — rows are never updated or deleted.
-- See README.md for full design rationale.

CREATE TYPE file_activity_action AS ENUM (
  'created',
  'uploaded',
  'updated',
  'renamed',
  'moved',
  'copied',
  'deleted',
  'restored',
  'shared',
  'unshared',
  'downloaded',
  'locked',
  'unlocked',
  'commented',
  'version_created'
);

CREATE TYPE file_activity_target_type AS ENUM ('file', 'folder');

CREATE TABLE file_activities (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  action            file_activity_action NOT NULL,

  target_type       file_activity_target_type NOT NULL, -- Whether the action was on a file or folder.
  target_id         UUID NOT NULL,                      -- The file or folder ID. Not a FK — target may be permanently deleted.
  target_name       TEXT NOT NULL,                       -- Denormalized: file/folder name at the time of the action.

  details           JSONB,                               -- Action-specific context (e.g., moved: {from_folder_id, to_folder_id}).
  ip_address        TEXT,                                -- Client IP address for security audit.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()   -- Activities are immutable (append-only). No updated_at.
);

CREATE INDEX idx_file_activities_actor_id ON file_activities (actor_id);
CREATE INDEX idx_file_activities_target ON file_activities (target_type, target_id);
CREATE INDEX idx_file_activities_action ON file_activities (action);
CREATE INDEX idx_file_activities_created_at ON file_activities (created_at);
