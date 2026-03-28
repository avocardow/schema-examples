-- chart_entries: Weekly track positions within a chart.
-- See README.md for full design rationale.

CREATE TABLE chart_entries (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id          UUID NOT NULL,
    track_id          UUID NOT NULL,
    position          INTEGER NOT NULL,
    previous_position INTEGER,
    peak_position     INTEGER NOT NULL,
    weeks_on_chart    INTEGER NOT NULL DEFAULT 1,
    chart_date        TEXT NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chart_entries_chart_id_chart_date_position ON chart_entries (chart_id, chart_date, position);
CREATE INDEX idx_chart_entries_track_id_chart_date ON chart_entries (track_id, chart_date);

-- Forward FK: charts is defined in charts.sql (loaded after this file).
ALTER TABLE chart_entries ADD CONSTRAINT fk_chart_entries_chart_id
    FOREIGN KEY (chart_id) REFERENCES charts(id) ON DELETE CASCADE;

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE chart_entries ADD CONSTRAINT fk_chart_entries_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;
