-- file_shortcuts: Cross-folder references without file duplication — similar to Google Drive shortcuts.
-- See README.md for full design rationale.

CREATE TYPE file_shortcut_target_type AS ENUM ('file', 'folder');

CREATE TABLE file_shortcuts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id         UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
                                                   -- The folder where this shortcut lives.
                                                   -- Cascade: deleting the containing folder removes its shortcuts.

  -- What the shortcut points to. Exactly one of target_file_id or target_folder_id must be set.
  target_type       file_shortcut_target_type NOT NULL, -- Discriminator for which FK is populated.
  target_file_id    UUID REFERENCES files(id) ON DELETE CASCADE,
                                                   -- Populated when target_type = 'file'.
                                                   -- Cascade: shortcut removed when target file is deleted.
  target_folder_id  UUID REFERENCES folders(id) ON DELETE CASCADE,
                                                   -- Populated when target_type = 'folder'.
                                                   -- Cascade: shortcut removed when target folder is deleted.

  name              TEXT,                           -- Override display name. Null = use the target's name.
  created_by        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_file_shortcuts_folder_id ON file_shortcuts (folder_id);
CREATE INDEX idx_file_shortcuts_target_file_id ON file_shortcuts (target_file_id);
CREATE INDEX idx_file_shortcuts_target_folder_id ON file_shortcuts (target_folder_id);
