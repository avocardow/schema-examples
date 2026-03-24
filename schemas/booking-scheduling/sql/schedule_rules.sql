-- schedule_rules: Recurring weekly availability windows for a given schedule.
-- See README.md for full design rationale.

CREATE TABLE schedule_rules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id     UUID NOT NULL,
  day_of_week     INTEGER NOT NULL,
  start_time      TEXT NOT NULL,
  end_time        TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedule_rules_schedule_id_day_of_week ON schedule_rules (schedule_id, day_of_week);

-- Forward FK: schedules loads after this file alphabetically.
ALTER TABLE schedule_rules
  ADD CONSTRAINT fk_schedule_rules_schedule
  FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE CASCADE;
