-- sla_policy_targets: Per-priority response and resolution time targets within an SLA policy.
-- See README.md for full design rationale.

CREATE TABLE sla_policy_targets (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sla_policy_id          UUID NOT NULL REFERENCES sla_policies (id) ON DELETE CASCADE,
  priority_id            UUID NOT NULL,
  first_response_minutes INTEGER,
  next_response_minutes  INTEGER,
  resolution_minutes     INTEGER,
  UNIQUE (sla_policy_id, priority_id)
);

-- Forward FK: ticket_priorities loads after sla_policy_targets alphabetically.
ALTER TABLE sla_policy_targets
  ADD CONSTRAINT fk_sla_policy_targets_priority
  FOREIGN KEY (priority_id) REFERENCES ticket_priorities (id) ON DELETE CASCADE;
