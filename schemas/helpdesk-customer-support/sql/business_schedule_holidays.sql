-- business_schedule_holidays: Non-working holiday dates within a business schedule.
-- See README.md for full design rationale.

CREATE TABLE business_schedule_holidays (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES business_schedules (id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  date        TEXT NOT NULL,
  UNIQUE (schedule_id, date)
);
