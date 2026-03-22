-- quiet_hours: Per-user Do Not Disturb schedules with timezone support.
-- See README.md for full design rationale and field documentation.

CREATE TABLE quiet_hours (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- IANA timezone (e.g., "America/New_York", "Europe/London", "Asia/Tokyo").
  -- Quiet hours are evaluated in the user's local time.
  timezone        TEXT NOT NULL,

  -- The quiet window. Local times in HH:MM format, no date component.
  -- Cross-midnight schedules work naturally: start=22:00, end=08:00 means 10pm to 8am.
  start_time      TEXT NOT NULL,                    -- HH:MM format (e.g., "22:00").
  end_time        TEXT NOT NULL,                    -- HH:MM format (e.g., "08:00").

  -- ISO day numbers: 1=Monday … 7=Sunday. E.g., {1,2,3,4,5} = weekdays only.
  days_of_week    INTEGER[] NOT NULL,

  is_active       BOOLEAN NOT NULL DEFAULT TRUE,    -- Toggle the schedule without deleting it.

  -- Ad-hoc snooze: temporary DND override. Null = no active snooze.
  snooze_until    TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiet_hours_user_id ON quiet_hours (user_id);
CREATE INDEX idx_quiet_hours_user_id_is_active ON quiet_hours (user_id, is_active);
