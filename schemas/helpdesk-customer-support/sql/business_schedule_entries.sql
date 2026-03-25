-- business_schedule_entries: Working-hour blocks for each day within a business schedule.
-- See README.md for full design rationale.

CREATE TABLE business_schedule_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES business_schedules (id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time  TEXT NOT NULL,
  end_time    TEXT NOT NULL
);

CREATE INDEX idx_business_schedule_entries_sched_day ON business_schedule_entries (schedule_id, day_of_week);
