-- file_attachments: Polymorphic join table — attach files to any entity in any domain.
-- See README.md for full design rationale.

CREATE TABLE file_attachments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id         UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
                                                   -- The attached file.
                                                   -- Cascade: deleting a file removes all its attachment records.

  -- Polymorphic target: what entity this file is attached to.
  -- Not FKs — the target table depends on the consuming domain.
  record_type     TEXT NOT NULL,                    -- Entity type (e.g., "products", "users", "posts", "tickets").
  record_id       UUID NOT NULL,                    -- Entity primary key.

  name            TEXT NOT NULL,                    -- Attachment slot/purpose (e.g., "avatar", "cover_image", "documents").
  position        INTEGER NOT NULL DEFAULT 0,       -- Ordering within a slot. Allows drag-and-drop reordering.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
                                                   -- Attachments are immutable links. No updated_at.
);

-- Prevent duplicate attachments of the same file in the same slot.
CREATE UNIQUE INDEX idx_file_attachments_unique_slot
  ON file_attachments (record_type, record_id, name, file_id);

-- "Where is this file used?" — orphan detection.
CREATE INDEX idx_file_attachments_file_id
  ON file_attachments (file_id);

-- "All files in this slot for this entity" — the primary lookup.
CREATE INDEX idx_file_attachments_record_slot
  ON file_attachments (record_type, record_id, name);

-- "All attachments for this entity" (across all slots).
CREATE INDEX idx_file_attachments_record
  ON file_attachments (record_type, record_id);
