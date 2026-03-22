-- dashboard_widgets: Individual visualization widgets positioned on a dashboard.
-- See README.md for full design rationale.

CREATE TYPE widget_chart_type AS ENUM ('line', 'bar', 'area', 'pie', 'number', 'table', 'funnel', 'map');

CREATE TABLE dashboard_widgets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id  UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  metric_id     UUID REFERENCES metric_definitions(id) ON DELETE SET NULL,
  title         TEXT,
  chart_type    widget_chart_type NOT NULL DEFAULT 'line',
  config        JSONB,
  position_x    INTEGER NOT NULL DEFAULT 0,
  position_y    INTEGER NOT NULL DEFAULT 0,
  width         INTEGER NOT NULL DEFAULT 6,
  height        INTEGER NOT NULL DEFAULT 4,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dashboard_widgets_dashboard_id ON dashboard_widgets (dashboard_id);
CREATE INDEX idx_dashboard_widgets_metric_id ON dashboard_widgets (metric_id);
