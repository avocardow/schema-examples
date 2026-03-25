// business_schedules: named business-hour schedules with timezone for SLA clock calculation.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const businessSchedules = pgTable(
  "business_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    timezone: text("timezone").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);
