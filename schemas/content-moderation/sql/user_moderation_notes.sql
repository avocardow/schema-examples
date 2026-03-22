-- user_moderation_notes: Internal moderator notes on user accounts.
-- See README.md for full design rationale.

CREATE TABLE user_moderation_notes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                 -- The user this note is about.
                                                 -- Cascade: deleting a user removes all their notes.
  author_id         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                 -- The moderator who wrote this note.
                                                 -- Restrict: don't delete moderators who have notes.
  body              TEXT NOT NULL,               -- The note text. Internal-only, never shown to the user.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_moderation_notes_user_id ON user_moderation_notes (user_id);
CREATE INDEX idx_user_moderation_notes_author_id ON user_moderation_notes (author_id);
