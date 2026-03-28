// chart_entries: Individual track positions within a chart for a given date.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { charts } from "./charts";
import { tracks } from "./tracks";

export const chartEntries = pgTable(
  "chart_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    chartId: uuid("chart_id").notNull().references(() => charts.id, { onDelete: "cascade" }),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    previousPosition: integer("previous_position"),
    peakPosition: integer("peak_position").notNull(),
    weeksOnChart: integer("weeks_on_chart").notNull().default(1),
    chartDate: text("chart_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_chart_entries_chart_id_chart_date_position").on(table.chartId, table.chartDate, table.position),
    index("idx_chart_entries_track_id_chart_date").on(table.trackId, table.chartDate),
  ]
);
