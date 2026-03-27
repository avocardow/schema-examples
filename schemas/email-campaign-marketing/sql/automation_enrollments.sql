-- automation_enrollments: Tracks contacts enrolled in automation workflows and their progress.
-- See README.md for full design rationale.

CREATE TYPE automation_enrollment_status AS ENUM ('active', 'completed', 'paused', 'exited');

CREATE TABLE automation_enrollments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id     UUID NOT NULL,
    contact_id      UUID NOT NULL,
    current_step_id UUID,
    status          automation_enrollment_status NOT NULL DEFAULT 'active',
    enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (workflow_id, contact_id)
);

CREATE INDEX idx_automation_enrollments_contact_id ON automation_enrollments (contact_id);
CREATE INDEX idx_automation_enrollments_status ON automation_enrollments (status);

-- Forward FK: automation_workflows is defined in automation_workflows.sql (loaded after this file).
ALTER TABLE automation_enrollments ADD CONSTRAINT fk_automation_enrollments_workflow_id
  FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE;

-- Forward FK: contacts is defined in contacts.sql (loaded after this file).
ALTER TABLE automation_enrollments ADD CONSTRAINT fk_automation_enrollments_contact_id
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

-- Forward FK: automation_steps is defined in automation_steps.sql (loaded after this file).
ALTER TABLE automation_enrollments ADD CONSTRAINT fk_automation_enrollments_current_step_id
  FOREIGN KEY (current_step_id) REFERENCES automation_steps(id) ON DELETE SET NULL;
