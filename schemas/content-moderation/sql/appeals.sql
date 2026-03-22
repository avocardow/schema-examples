-- appeals: User appeals against moderation actions, with one-appeal-per-action enforcement.
-- See README.md for full design rationale.

CREATE TYPE appeal_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE appeals (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  moderation_action_id  UUID NOT NULL,                       -- The action being appealed.
                                                             -- FK added via ALTER TABLE (moderation_actions loads after appeals).
                                                             -- Restrict: cannot delete an action that has an active appeal.

  appellant_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                             -- Who submitted the appeal.
                                                             -- Cascade: if user is deleted, their appeals are removed.

  appeal_text           TEXT NOT NULL,                       -- The user's explanation of why the action should be overturned.

  status                appeal_status NOT NULL DEFAULT 'pending',
                                                             -- pending = awaiting review.
                                                             -- approved = action overturned.
                                                             -- rejected = action upheld.

  reviewer_id           UUID REFERENCES users(id) ON DELETE SET NULL,
                                                             -- Moderator who reviewed the appeal. Null = pending.

  reviewer_notes        TEXT,                                -- Internal notes on the appeal decision.
  reviewed_at           TIMESTAMPTZ,                         -- When the appeal was decided. Null = pending.

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: moderation_actions is defined in moderation_actions.sql (loaded after appeals.sql).
ALTER TABLE appeals ADD CONSTRAINT fk_appeals_moderation_action_id
  FOREIGN KEY (moderation_action_id) REFERENCES moderation_actions(id) ON DELETE RESTRICT;

CREATE UNIQUE INDEX idx_appeals_moderation_action_id ON appeals(moderation_action_id);
CREATE INDEX idx_appeals_appellant_id ON appeals(appellant_id);
CREATE INDEX idx_appeals_status ON appeals(status);
CREATE INDEX idx_appeals_reviewer_id ON appeals(reviewer_id);
CREATE INDEX idx_appeals_created_at ON appeals(created_at);
