-- moderation_rules: Configurable auto-moderation rules with trigger conditions and actions.
-- See README.md for full design rationale.

CREATE TYPE moderation_rule_scope AS ENUM ('global', 'community', 'channel');
CREATE TYPE moderation_rule_trigger_type AS ENUM (
  'keyword', 'regex', 'ml_score', 'hash_match', 'mention_spam', 'user_attribute'
);
CREATE TYPE moderation_rule_action_type AS ENUM (
  'block', 'flag', 'hold', 'timeout', 'notify'
);

CREATE TABLE moderation_rules (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,                     -- Human-readable rule name (e.g., "Block Profanity").
  description       TEXT,                              -- What this rule does and why it exists.
  scope             moderation_rule_scope NOT NULL DEFAULT 'global',
                                                       -- Where this rule applies.
  scope_id          TEXT,                              -- Community/channel ID. Null when scope = global.
  trigger_type      moderation_rule_trigger_type NOT NULL,
                                                       -- What type of content analysis triggers this rule.
                                                       -- keyword = matches words/phrases from a keyword_list.
                                                       -- regex = matches a regex pattern.
                                                       -- ml_score = ML model confidence exceeds threshold.
                                                       -- hash_match = perceptual hash match (PhotoDNA, etc.).
                                                       -- mention_spam = excessive @mentions.
                                                       -- user_attribute = checks user properties (age, karma, etc.).
  trigger_config    JSONB NOT NULL,                    -- Trigger-specific configuration. Examples:
                                                       -- keyword: {"keyword_list_id": "uuid", "match_type": "contains"}
                                                       -- regex: {"patterns": ["spam\\d+"], "case_sensitive": false}
                                                       -- ml_score: {"model": "perspective", "attribute": "toxicity", "threshold": 0.8}
                                                       -- hash_match: {"database": "photodna", "threshold": 0.95}
                                                       -- mention_spam: {"max_mentions": 10, "window_seconds": 60}
                                                       -- user_attribute: {"min_account_age_days": 7, "min_karma": 10}
  action_type       moderation_rule_action_type NOT NULL,
                                                       -- What happens when the rule triggers.
                                                       -- block = prevent content from being posted.
                                                       -- flag = post the content but add to moderation queue.
                                                       -- hold = hold for moderator approval before posting.
                                                       -- timeout = temporarily restrict the user.
                                                       -- notify = alert moderators without affecting content.
  action_config     JSONB DEFAULT '{}',                -- Action-specific parameters. Examples:
                                                       -- timeout: {"duration_minutes": 60}
                                                       -- notify: {"channel_id": "mod-alerts"}
                                                       -- block: {"custom_message": "Your message was blocked."}
  priority          INTEGER NOT NULL DEFAULT 0,        -- Rule evaluation order. Higher = evaluated first.
                                                       -- First matching rule wins (no further evaluation).
  is_enabled        BOOLEAN NOT NULL DEFAULT TRUE,     -- Disable without deleting.
  created_by        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                       -- Who created this rule.
                                                       -- Restrict: don't delete users who own rules.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_moderation_rules_scope ON moderation_rules (scope, scope_id, is_enabled);
CREATE INDEX idx_moderation_rules_trigger_type ON moderation_rules (trigger_type);
CREATE INDEX idx_moderation_rules_enabled_priority ON moderation_rules (is_enabled, priority);
