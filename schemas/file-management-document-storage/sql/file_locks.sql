-- file_locks: Collaborative file locking to prevent concurrent edits — one lock per file.
-- See README.md for full design rationale and field documentation.

CREATE TYPE lock_type AS ENUM ('exclusive', 'shared');

CREATE TABLE file_locks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id         UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
                                                   -- The locked file.
                                                   -- UNIQUE: only one lock per file at a time.
                                                   -- Cascade: deleting a file releases its lock.
  locked_by       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                   -- Who holds the lock.
                                                   -- Cascade: deleting a user releases their locks.
  lock_type       lock_type NOT NULL DEFAULT 'exclusive',
                                                   -- exclusive = only lock holder can edit.
                                                   -- shared = cooperative read-only mode.
  reason          TEXT,                             -- Why the file is locked (e.g., "Editing in Word", "Under review").
  expires_at      TIMESTAMPTZ,                     -- When the lock automatically expires. Null = indefinite.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at — locks are short-lived; to extend, release and re-acquire.
);

CREATE INDEX idx_file_locks_locked_by ON file_locks (locked_by);
CREATE INDEX idx_file_locks_expires_at ON file_locks (expires_at);
