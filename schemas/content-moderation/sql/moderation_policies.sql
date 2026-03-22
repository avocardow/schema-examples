-- moderation_policies: Community or platform-level rule definitions scoped globally or to a community/channel.
-- See README.md for full design rationale.

CREATE TYPE moderation_policy_scope AS ENUM ('global', 'community', 'channel');

CREATE TABLE moderation_policies (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope                 moderation_policy_scope NOT NULL DEFAULT 'global',
                                                         -- Where this policy applies.
                                                         -- global = platform-wide.
                                                         -- community = specific community/subreddit/server.
                                                         -- channel = specific channel/room.
  scope_id              TEXT,                             -- ID of the community/channel. Null when scope = global.
                                                         -- Text, not UUID — supports external ID formats.
  title                 TEXT NOT NULL,                    -- Short policy title (e.g., "No Hate Speech").
  description           TEXT NOT NULL,                    -- Full policy text explaining what's prohibited and why.
  violation_category_id UUID,                             -- Which violation category this policy maps to.
                                                         -- FK added via ALTER TABLE below (forward reference).
  sort_order            INTEGER NOT NULL DEFAULT 0,       -- Display ordering within the scope.
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,    -- Soft-disable without deleting.
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: violation_categories is defined in violation_categories.sql (loaded after moderation_policies.sql).
ALTER TABLE moderation_policies ADD CONSTRAINT fk_moderation_policies_violation_category_id
  FOREIGN KEY (violation_category_id) REFERENCES violation_categories(id) ON DELETE SET NULL;

CREATE INDEX idx_moderation_policies_scope ON moderation_policies(scope, scope_id);
CREATE INDEX idx_moderation_policies_violation_category ON moderation_policies(violation_category_id);
CREATE INDEX idx_moderation_policies_is_active ON moderation_policies(is_active);
