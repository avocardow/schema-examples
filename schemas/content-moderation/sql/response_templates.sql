-- response_templates: Pre-written response messages for moderators to use when taking enforcement actions.
-- See README.md for full design rationale.

CREATE TYPE response_template_action_type AS ENUM (
  'approve', 'remove', 'warn', 'mute', 'ban', 'restrict', 'escalate', 'label'
);

CREATE TYPE response_template_scope AS ENUM ('global', 'community');

CREATE TABLE response_templates (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,                    -- Internal template name (e.g., "Spam Removal — First Offense").
  action_type           response_template_action_type,    -- Which moderation action this template is for.
                                                          -- Null = usable with any action type.
  content               TEXT NOT NULL,                    -- Template text. May include placeholders like
                                                          -- {{username}}, {{rule}}, {{appeal_url}}.
  violation_category_id UUID,                             -- Suggested violation category for this template.
                                                          -- Set null: if category is deleted, template remains.
                                                          -- FK added via ALTER TABLE below (forward reference).
  scope                 response_template_scope NOT NULL DEFAULT 'global',
                                                          -- global = available everywhere.
                                                          -- community = specific to one community.
  scope_id              TEXT,                             -- Community ID. Null when scope = global.
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_by            UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                          -- Who created this template.
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: violation_categories is defined in violation_categories.sql (loaded after response_templates.sql).
ALTER TABLE response_templates ADD CONSTRAINT fk_response_templates_violation_category_id
  FOREIGN KEY (violation_category_id) REFERENCES violation_categories(id) ON DELETE SET NULL;

CREATE INDEX idx_response_templates_scope ON response_templates (scope, scope_id);
CREATE INDEX idx_response_templates_action_type ON response_templates (action_type);
CREATE INDEX idx_response_templates_violation_category ON response_templates (violation_category_id);
CREATE INDEX idx_response_templates_is_active ON response_templates (is_active);
