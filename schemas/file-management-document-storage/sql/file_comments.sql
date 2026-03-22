-- file_comments: Threaded comments on files — supports nested replies via parent_id self-reference and resolved state for review workflows.
-- See README.md for full design rationale and field documentation.

CREATE TABLE file_comments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id           UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
                                                 -- The file being commented on.
                                                 -- Cascade: deleting a file removes all its comments.
  parent_id         UUID REFERENCES file_comments(id) ON DELETE CASCADE,
                                                 -- Parent comment for threaded replies. Null = top-level comment.
                                                 -- Cascade: deleting a parent removes all its replies.
  author_id         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                 -- Who wrote this comment.
  body              TEXT NOT NULL,               -- Comment text. Supports plain text or markdown.
  is_resolved       BOOLEAN NOT NULL DEFAULT FALSE,
                                                 -- Whether this comment thread is resolved.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
                                                 -- Comments can be edited. updated_at tracks the last edit time.
);

CREATE INDEX idx_file_comments_file_id_created_at ON file_comments (file_id, created_at);
CREATE INDEX idx_file_comments_parent_id ON file_comments (parent_id);
CREATE INDEX idx_file_comments_author_id ON file_comments (author_id);
