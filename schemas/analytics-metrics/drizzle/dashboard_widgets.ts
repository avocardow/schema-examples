// dashboard_widgets: Individual visualization widgets placed on dashboards.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { dashboards } from "./dashboards";
import { metricDefinitions } from "./metric_definitions";

export const chartTypeEnum = pgEnum("chart_type", [
  "line",
  "bar",
  "area",
  "pie",
  "number",
  "table",
  "funnel",
  "map",
]);

export const dashboardWidgets = pgTable(
  "dashboard_widgets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dashboardId: uuid("dashboard_id").notNull().references(() => dashboards.id, { onDelete: "cascade" }),
    metricId: uuid("metric_id").references(() => metricDefinitions.id, { onDelete: "set null" }),
    title: text("title"),
    chartType: chartTypeEnum("chart_type").notNull().default("line"),
    config: jsonb("config"),
    positionX: integer("position_x").notNull().default(0),
    positionY: integer("position_y").notNull().default(0),
    width: integer("width").notNull().default(6),
    height: integer("height").notNull().default(4),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_dashboard_widgets_dashboard_id").on(table.dashboardId),
    index("idx_dashboard_widgets_metric_id").on(table.metricId),
  ]
);
