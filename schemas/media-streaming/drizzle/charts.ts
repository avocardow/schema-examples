// charts: Curated or algorithmic music charts (e.g., Top 50, Viral).
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const chartTypeEnum = pgEnum("chart_type", ["top", "viral", "new_releases", "trending"]);

export const charts = pgTable(
  "charts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    chartType: chartTypeEnum("chart_type").notNull(),
    region: text("region"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_charts_chart_type_region").on(table.chartType, table.region),
    index("idx_charts_is_active").on(table.isActive),
  ]
);
