-- automation_steps: Individual actions within an automation workflow sequence.
-- See README.md for full design rationale.

CREATE TYPE automation_step_type AS ENUM ('send_email', 'delay', 'condition');

CREATE TABLE automation_steps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id     UUID NOT NULL,
    step_order      INTEGER NOT NULL,
    step_type       automation_step_type NOT NULL,
    template_id     UUID,
    config          JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (workflow_id, step_order)
);

CREATE INDEX idx_automation_steps_template_id ON automation_steps (template_id);

-- Forward FK: automation_workflows is defined in automation_workflows.sql (loaded after this file).
ALTER TABLE automation_steps ADD CONSTRAINT fk_automation_steps_workflow_id
  FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE;

-- Forward FK: templates is defined in templates.sql (loaded after this file).
ALTER TABLE automation_steps ADD CONSTRAINT fk_automation_steps_template_id
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL;
