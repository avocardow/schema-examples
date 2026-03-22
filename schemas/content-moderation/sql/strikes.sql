-- strikes: Accumulated violations for users — a YouTube-style strike system with configurable expiry.
-- See README.md for full design rationale.

CREATE TYPE strike_severity AS ENUM ('minor', 'moderate', 'severe');
CREATE TYPE strike_resolution AS ENUM ('active', 'expired', 'appealed_overturned');

CREATE TABLE strikes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                           -- The user who received the strike.
                                                           -- Cascade: if user is deleted, their strikes are removed.
  moderation_action_id  UUID NOT NULL REFERENCES moderation_actions(id) ON DELETE RESTRICT,
                                                           -- The action that generated this strike.
                                                           -- Restrict: cannot delete an action that has a strike record.
  violation_category_id UUID,                              -- What type of violation the strike is for.
                                                           -- FK added via ALTER TABLE (violation_categories loads after strikes).
  severity              strike_severity NOT NULL DEFAULT 'moderate',
                                                           -- Strike weight. Severe strikes may count as 2 or 3.
  issued_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at            TIMESTAMPTZ,                       -- When this strike expires. Null = never expires.
                                                           -- YouTube: 90 days if no repeat violation and training completed.
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,     -- Whether this strike is currently counting.
                                                           -- False = expired or overturned on appeal.
  resolution            strike_resolution NOT NULL DEFAULT 'active',
                                                           -- active = currently counting against the user.
                                                           -- expired = strike expired after the configured period.
                                                           -- appealed_overturned = strike removed via successful appeal.
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: violation_categories is defined in violation_categories.sql (loaded after strikes.sql).
ALTER TABLE strikes ADD CONSTRAINT fk_strikes_violation_category_id
  FOREIGN KEY (violation_category_id) REFERENCES violation_categories(id) ON DELETE SET NULL;

CREATE INDEX idx_strikes_user_active ON strikes (user_id, is_active);
CREATE INDEX idx_strikes_moderation_action ON strikes (moderation_action_id);
CREATE INDEX idx_strikes_violation_category ON strikes (violation_category_id);
CREATE INDEX idx_strikes_expires_active ON strikes (expires_at, is_active);
CREATE INDEX idx_strikes_resolution ON strikes (resolution);
