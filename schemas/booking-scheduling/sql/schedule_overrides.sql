-- schedule_overrides: Date-specific availability exceptions that override regular schedule rules.
-- See README.md for full design rationale.

CREATE TABLE schedule_overrides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id     UUID NOT NULL,
  override_date   TEXT NOT NULL,
  start_time      TEXT,
  end_time        TEXT,
  is_available    BOOLEAN NOT NULL DEFAULT TRUE,
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedule_overrides_schedule_id_override_date ON schedule_overrides (schedule_id, override_date);

-- Forward FK: schedules loads after this file alphabetically.
ALTER TABLE schedule_overrides
  ADD CONSTRAINT fk_schedule_overrides_schedule
  FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE CASCADE;
