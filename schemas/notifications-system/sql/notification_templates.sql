-- notification_templates: Reusable content definitions for a notification category.
-- See README.md for full design rationale and field documentation.

CREATE TABLE notification_templates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id         UUID NOT NULL REFERENCES notification_categories(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,                    -- Internal name (e.g., "Comment Created — Default").
  slug                TEXT UNIQUE NOT NULL,             -- Identifier used in code (e.g., "comment_created_default").

  -- Default content (channel-agnostic). Used when no channel-specific template_content exists.
  title_template      TEXT,                             -- e.g., "New comment on {{issue_title}}"
  body_template       TEXT,                             -- e.g., "{{actor_name}} commented: {{comment_body}}"
  action_url_template TEXT,                             -- e.g., "{{app_url}}/issues/{{issue_id}}#comment-{{comment_id}}"

  is_active           BOOLEAN NOT NULL DEFAULT TRUE,    -- Toggle a template without deleting it. Inactive templates are skipped during delivery.
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_templates_category_id ON notification_templates (category_id);
