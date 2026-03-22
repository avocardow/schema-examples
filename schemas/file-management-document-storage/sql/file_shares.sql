-- file_shares: Direct access grants to specific users, groups, or organizations.
-- See README.md for full design rationale.

CREATE TYPE file_share_target_type AS ENUM ('file', 'folder');
CREATE TYPE file_share_shared_with_type AS ENUM ('user', 'group', 'organization');
CREATE TYPE file_share_role AS ENUM ('viewer', 'commenter', 'editor', 'co_owner');

CREATE TABLE file_shares (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What is being shared. Exactly one of target_file_id or target_folder_id must be set.
  target_type       file_share_target_type NOT NULL, -- Discriminator for which FK is populated.
  target_file_id    UUID REFERENCES files(id) ON DELETE CASCADE,
                                                     -- Populated when target_type = 'file'.
                                                     -- Cascade: deleting the file removes all its shares.
  target_folder_id  UUID REFERENCES folders(id) ON DELETE CASCADE,
                                                     -- Populated when target_type = 'folder'.
                                                     -- Cascade: deleting the folder removes all its shares.

  shared_by         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                     -- Who created this share.
                                                     -- Restrict: don't delete users who have active shares.

  -- Who the share is granted to. Target depends on shared_with_type.
  shared_with_type  file_share_shared_with_type NOT NULL,
  shared_with_id    UUID NOT NULL,                   -- Polymorphic — not a FK.

  role              file_share_role NOT NULL,
  allow_reshare     BOOLEAN NOT NULL DEFAULT FALSE,  -- Whether the recipient can share this item with others.
  expires_at        TIMESTAMPTZ,                     -- Null = never expires.
  accepted_at       TIMESTAMPTZ,                     -- Null = pending acceptance.
  message           TEXT,                            -- Optional message to the recipient.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_file_shares_target_file ON file_shares (target_type, target_file_id);
CREATE INDEX idx_file_shares_target_folder ON file_shares (target_type, target_folder_id);
CREATE INDEX idx_file_shares_shared_with ON file_shares (shared_with_type, shared_with_id);
CREATE INDEX idx_file_shares_shared_by ON file_shares (shared_by);
CREATE INDEX idx_file_shares_expires_at ON file_shares (expires_at);
