// pay_schedules: Defines recurring payroll cadences (weekly, biweekly, etc.) with anchor dates.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const payScheduleFrequencyEnum = pgEnum("pay_schedule_frequency", [
  "weekly",
  "biweekly",
  "semimonthly",
  "monthly",
]);

export const paySchedules = pgTable(
  "pay_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull(),
    frequency: payScheduleFrequencyEnum("frequency").notNull(),
    anchorDate: text("anchor_date").notNull(),

    isActive: boolean("is_active").notNull().default(true),
    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_pay_schedules_frequency").on(table.frequency),
    index("idx_pay_schedules_is_active").on(table.isActive),
  ]
);
