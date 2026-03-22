-- report_notes: Internal moderator notes on reports — append-only, never edited.
-- See README.md for full design rationale.

CREATE TABLE report_notes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_item_id     UUID NOT NULL REFERENCES moderation_queue_items(id) ON DELETE CASCADE,
                                                 -- The queue item this note is attached to.
                                                 -- Cascade: deleting a queue item removes all its notes.
  moderator_id      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                 -- Who wrote this note.
                                                 -- Restrict: don't delete moderators who have notes.
  content           TEXT NOT NULL,               -- The note text. Internal-only, never shown to the reported user.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
                                                 -- Append-only: notes are never edited. No updated_at.
);

CREATE INDEX idx_report_notes_queue_item_id ON report_notes (queue_item_id);
CREATE INDEX idx_report_notes_moderator_id ON report_notes (moderator_id);
