-- user_restrictions: Active restrictions on user accounts with full lifecycle tracking.
-- See README.md for full design rationale.

CREATE TYPE user_restriction_type AS ENUM (
  'ban', 'mute', 'post_restriction', 'shadow_ban', 'warning', 'probation'
);

CREATE TYPE user_restriction_scope AS ENUM ('global', 'community', 'channel');

CREATE TABLE user_restrictions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                        -- The restricted user.
                                                        -- Cascade: if user is deleted, their restrictions are removed.
  restriction_type     user_restriction_type NOT NULL,
  scope                user_restriction_scope NOT NULL DEFAULT 'global',
                                                        -- Where the restriction applies.
  scope_id             TEXT,                             -- Community/channel ID. Null when scope = global.
  reason               TEXT,                             -- Why the restriction was imposed.
  moderation_action_id UUID REFERENCES moderation_actions(id) ON DELETE SET NULL,
                                                        -- The moderation action that created this restriction.
  imposed_by           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                        -- Moderator who imposed the restriction.
                                                        -- Restrict: don't delete moderators who have imposed restrictions.
  imposed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                                        -- When the restriction was imposed.
  expires_at           TIMESTAMPTZ,                     -- When the restriction expires. Null = permanent.
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,   -- Whether the restriction is currently in effect.
  lifted_by            UUID REFERENCES users(id) ON DELETE SET NULL,
                                                        -- Moderator who lifted the restriction early.
  lifted_at            TIMESTAMPTZ,                     -- When the restriction was lifted. Null = still active or expired.
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_restrictions_user_active ON user_restrictions (user_id, is_active);
CREATE INDEX idx_user_restrictions_type ON user_restrictions (restriction_type);
CREATE INDEX idx_user_restrictions_scope ON user_restrictions (scope, scope_id);
CREATE INDEX idx_user_restrictions_expires ON user_restrictions (expires_at, is_active);
CREATE INDEX idx_user_restrictions_imposed_by ON user_restrictions (imposed_by);
