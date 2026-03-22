-- moderator_performance: Pre-aggregated moderator performance metrics for reporting and workload management.
-- See README.md for full design rationale.

CREATE TABLE moderator_performance (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  moderator_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                                 -- The moderator being measured.
                                                                 -- Cascade: if moderator is deleted, their metrics are removed.
  period_start                TIMESTAMPTZ NOT NULL,              -- Start of the measurement period.
  period_end                  TIMESTAMPTZ NOT NULL,              -- End of the measurement period.
  items_reviewed              INTEGER NOT NULL DEFAULT 0,        -- Total queue items reviewed during this period.
  items_actioned              INTEGER NOT NULL DEFAULT 0,        -- Items where enforcement action was taken (vs approved/dismissed).
  average_review_time_seconds INTEGER NOT NULL DEFAULT 0,        -- Mean time from assignment to resolution, in seconds.
  appeals_overturned          INTEGER NOT NULL DEFAULT 0,        -- Actions by this moderator that were overturned on appeal.
  accuracy_score              NUMERIC NOT NULL DEFAULT 1.0,      -- 1.0 - (appeals_overturned / items_actioned), clamped to 0-1.
                                                                 -- Higher = more consistent with appeal outcomes.
  computed_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When this rollup was last computed.
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (moderator_id, period_start, period_end)
);

CREATE INDEX idx_moderator_performance_period ON moderator_performance (period_start, period_end);
