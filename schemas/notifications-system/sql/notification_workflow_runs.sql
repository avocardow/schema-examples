-- notification_workflow_runs: Execution instances of a workflow, tracking state from trigger to completion.
-- See README.md for full design rationale and field documentation.

CREATE TYPE workflow_run_status_enum AS ENUM ('pending', 'running', 'completed', 'failed', 'canceled');

CREATE TABLE notification_workflow_runs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id         UUID NOT NULL REFERENCES notification_workflows(id) ON DELETE CASCADE,
  event_id            UUID NOT NULL REFERENCES notification_events(id) ON DELETE CASCADE,

  -- Execution lifecycle.
  status              workflow_run_status_enum NOT NULL DEFAULT 'pending',

  -- Which step the workflow is currently on (or last completed).
  current_step_order  INTEGER,

  -- Error details if the run failed.
  error_message       TEXT,                         -- Human-readable description of what went wrong.
  error_step_id       UUID REFERENCES notification_workflow_steps(id) ON DELETE SET NULL,

  started_at          TIMESTAMPTZ,                  -- When execution began.
  completed_at        TIMESTAMPTZ,                  -- When execution finished (success or failure).
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_workflow_runs_workflow_status ON notification_workflow_runs (workflow_id, status);
CREATE INDEX idx_notification_workflow_runs_event_id ON notification_workflow_runs (event_id);
CREATE INDEX idx_notification_workflow_runs_status_created ON notification_workflow_runs (status, created_at);
CREATE INDEX idx_notification_workflow_runs_created_at ON notification_workflow_runs (created_at);
