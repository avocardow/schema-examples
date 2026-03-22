// metric_definitions: Reusable metric definitions with aggregation rules and filters.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { eventTypes } from "./event_types";

export const metricAggregationEnum = pgEnum("metric_aggregation", [
  "count",
  "sum",
  "average",
  "min",
  "max",
  "count_unique",
  "percentile",
]);

export const metricDefinitions = pgTable(
  "metric_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(),
    displayName: text("display_name").notNull(),
    description: text("description"),
    aggregation: metricAggregationEnum("aggregation").notNull(),
    eventTypeId: uuid("event_type_id").references(() => eventTypes.id, { onDelete: "set null" }),
    propertyKey: text("property_key"),
    filters: jsonb("filters"),
    unit: text("unit"),
    format: text("format"),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_metric_definitions_event_type_id").on(table.eventTypeId),
    index("idx_metric_definitions_aggregation").on(table.aggregation),
    index("idx_metric_definitions_is_active").on(table.isActive),
    index("idx_metric_definitions_created_by").on(table.createdBy),
  ]
);
