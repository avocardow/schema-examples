-- user_trust_scores: User reputation tracking for moderation trust levels and behavioral scoring.
-- See README.md for full design rationale.

CREATE TYPE trust_level AS ENUM ('new', 'basic', 'member', 'trusted', 'veteran');

CREATE TABLE user_trust_scores (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                       -- One trust score record per user.

  -- new = new account, highest scrutiny.
  -- basic = verified email, some activity.
  -- member = established user, good standing.
  -- trusted = long history of compliance.
  -- veteran = exemplary record, may assist in moderation.
  trust_level         trust_level NOT NULL DEFAULT 'new',

  trust_score         NUMERIC NOT NULL DEFAULT 0.5,     -- Continuous score from 0.00 (lowest) to 1.00 (highest).
  total_reports_filed INTEGER NOT NULL DEFAULT 0,       -- Total reports this user has submitted.
  reports_upheld      INTEGER NOT NULL DEFAULT 0,       -- Reports that led to enforcement action.
  reports_dismissed   INTEGER NOT NULL DEFAULT 0,       -- Reports that were dismissed.
  flag_accuracy       NUMERIC NOT NULL DEFAULT 0.5,     -- reports_upheld / total_reports_filed (cached).
  content_violations  INTEGER NOT NULL DEFAULT 0,       -- Total times this user's content was actioned.
  last_violation_at   TIMESTAMPTZ,                      -- When the user's most recent violation occurred.
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- unique(user_id) is already created by the UNIQUE constraint above.
CREATE INDEX idx_user_trust_scores_trust_level ON user_trust_scores (trust_level);
CREATE INDEX idx_user_trust_scores_trust_score ON user_trust_scores (trust_score);
