-- notification_workflow_steps: Individual steps within a workflow, executed in ascending step_order.
-- See README.md for full design rationale and field documentation.

CREATE TYPE step_type_enum AS ENUM ('channel', 'delay', 'digest', 'condition', 'throttle');

CREATE TYPE channel_type_enum AS ENUM ('email', 'sms', 'push', 'in_app', 'chat', 'webhook');

CREATE TABLE notification_workflow_steps (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id       UUID NOT NULL REFERENCES notification_workflows(id) ON DELETE CASCADE,

  -- Execution order within the workflow. Steps run in ascending order.
  step_order        INTEGER NOT NULL,

  -- What this step does.
  -- channel = deliver to a specific channel.
  -- delay = wait for a duration before proceeding.
  -- digest = batch/accumulate events within a time window.
  -- condition = evaluate a rule; skip remaining steps if false.
  -- throttle = limit delivery frequency (e.g., max 1 per hour).
  step_type         step_type_enum NOT NULL,

  -- For channel steps: which channel type to deliver to.
  -- Null for non-channel step types.
  channel_type      channel_type_enum,

  -- Step configuration as JSON. Schema depends on step_type:
  -- channel:   { "channel_id": "uuid" }  — optional: use a specific provider. Null = use primary.
  -- delay:     { "duration": "5m", "unit": "minutes" }  — how long to wait.
  -- digest:    { "window": "1h", "key": "thread_key", "max_events": 100 }  — batching config.
  -- condition: { "field": "data.priority", "operator": "eq", "value": "high" }  — condition rule.
  -- throttle:  { "limit": 1, "window": "1h", "key": "recipient_id" }  — rate limit config.
  config            JSONB DEFAULT '{}'::jsonb,

  -- Should the workflow stop if this step fails?
  -- true = abort remaining steps (fail-fast). false = continue to next step (best-effort).
  should_stop_on_fail BOOLEAN NOT NULL DEFAULT FALSE,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (workflow_id, step_order)
);

CREATE INDEX idx_notification_workflow_steps_workflow_id ON notification_workflow_steps (workflow_id);
