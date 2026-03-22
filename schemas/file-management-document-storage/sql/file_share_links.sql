-- file_share_links: URL-based sharing with optional password protection, expiry, and download tracking.
-- See README.md for full design rationale.

CREATE TYPE file_share_link_target_type AS ENUM ('file', 'folder');
CREATE TYPE file_share_link_scope AS ENUM ('anyone', 'organization', 'specific_users');
CREATE TYPE file_share_link_permission AS ENUM ('view', 'download', 'edit', 'upload');

CREATE TABLE file_share_links (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What the link accesses. Exactly one of target_file_id or target_folder_id must be set.
  target_type       file_share_link_target_type NOT NULL,
  target_file_id    UUID REFERENCES files(id) ON DELETE CASCADE,
                                                   -- Populated when target_type = 'file'.
  target_folder_id  UUID REFERENCES folders(id) ON DELETE CASCADE,
                                                   -- Populated when target_type = 'folder'.

  created_by        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                   -- Who created this link.

  token             TEXT UNIQUE NOT NULL,           -- URL-safe token for the share link (e.g., /s/{token}).
                                                   -- Generate with a cryptographically secure random string.
  scope             file_share_link_scope NOT NULL DEFAULT 'anyone',
  permission        file_share_link_permission NOT NULL DEFAULT 'view',
  password_hash     TEXT,                           -- Hashed — never store plaintext.
  expires_at        TIMESTAMPTZ,                    -- When the link expires. Null = never expires.
  max_downloads     INTEGER,                        -- Maximum downloads allowed. Null = unlimited.
  download_count    INTEGER NOT NULL DEFAULT 0,     -- Increment atomically on each download.
  name              TEXT,                           -- Human-readable name (e.g., "Client review link").
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,  -- Disable a link without deleting it.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- unique(token) is already created by the UNIQUE constraint above.
CREATE INDEX idx_file_share_links_target_file ON file_share_links (target_type, target_file_id);
CREATE INDEX idx_file_share_links_target_folder ON file_share_links (target_type, target_folder_id);
CREATE INDEX idx_file_share_links_created_by ON file_share_links (created_by);
CREATE INDEX idx_file_share_links_expires_at ON file_share_links (expires_at);
