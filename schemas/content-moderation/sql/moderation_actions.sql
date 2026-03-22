-- moderation_actions: Enforcement actions taken by moderators or automated systems on content or user accounts.
-- See README.md for full design rationale.

CREATE TYPE moderation_action_type AS ENUM (
  'approve', 'remove', 'warn', 'mute', 'ban', 'restrict', 'escalate', 'label'
);

CREATE TYPE moderation_action_target_type AS ENUM ('content', 'user', 'account');

CREATE TABLE moderation_actions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  queue_item_id         UUID,                            -- The queue item that prompted this action.
                                                         -- Nullable: some actions (e.g., proactive bans) aren't from queue.
                                                         -- FK added via ALTER TABLE (moderation_queue_items loads later).

  moderator_id          UUID REFERENCES users(id) ON DELETE SET NULL,
                                                         -- Who took this action. Null = automated action.
                                                         -- Set null: if moderator is deleted, action preserves history.

  action_type           moderation_action_type NOT NULL,  -- Graduated enforcement level.
  target_type           moderation_action_target_type NOT NULL,
                                                         -- What the action applies to.
  target_id             TEXT NOT NULL,                    -- ID of the action target. String for external ID support.
  reason                TEXT,                            -- Moderator's explanation of why this action was taken.

  violation_category_id UUID,                            -- What policy category was violated.
                                                         -- FK added via ALTER TABLE (violation_categories loads later).

  response_template_id  UUID,                            -- Canned response used, if any.
                                                         -- FK added via ALTER TABLE (response_templates loads later).

  is_automated          BOOLEAN NOT NULL DEFAULT FALSE,  -- Whether this action was taken by an automated system.
                                                         -- DSA requires tracking automation level.

  metadata              JSONB DEFAULT '{}',              -- Action-specific details (duration, scope, label text, etc.).

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
                                                         -- Actions are immutable. No updated_at.
);

-- Forward FK: moderation_queue_items is defined in moderation_queue_items.sql (loaded after moderation_actions.sql).
ALTER TABLE moderation_actions ADD CONSTRAINT fk_moderation_actions_queue_item_id
  FOREIGN KEY (queue_item_id) REFERENCES moderation_queue_items(id) ON DELETE SET NULL;

-- Forward FK: violation_categories is defined in violation_categories.sql (loaded after moderation_actions.sql).
ALTER TABLE moderation_actions ADD CONSTRAINT fk_moderation_actions_violation_category_id
  FOREIGN KEY (violation_category_id) REFERENCES violation_categories(id) ON DELETE SET NULL;

-- Forward FK: response_templates is defined in response_templates.sql (loaded after moderation_actions.sql).
ALTER TABLE moderation_actions ADD CONSTRAINT fk_moderation_actions_response_template_id
  FOREIGN KEY (response_template_id) REFERENCES response_templates(id) ON DELETE SET NULL;

CREATE INDEX idx_moderation_actions_queue_item_id ON moderation_actions(queue_item_id);
CREATE INDEX idx_moderation_actions_moderator_id ON moderation_actions(moderator_id);
CREATE INDEX idx_moderation_actions_action_type ON moderation_actions(action_type);
CREATE INDEX idx_moderation_actions_target ON moderation_actions(target_type, target_id);
CREATE INDEX idx_moderation_actions_violation_category_id ON moderation_actions(violation_category_id);
CREATE INDEX idx_moderation_actions_is_automated ON moderation_actions(is_automated);
CREATE INDEX idx_moderation_actions_created_at ON moderation_actions(created_at);
