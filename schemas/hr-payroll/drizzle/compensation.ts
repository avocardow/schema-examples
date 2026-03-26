// compensation: Employee pay rates, types, and frequency with effective dating.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const payTypeEnum = pgEnum("pay_type", ["salary", "hourly"]);

export const payFrequencyEnum = pgEnum("pay_frequency", [
  "weekly",
  "biweekly",
  "semimonthly",
  "monthly",
  "annually",
]);

export const compensation = pgTable(
  "compensation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    payType: payTypeEnum("pay_type").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    payFrequency: payFrequencyEnum("pay_frequency").notNull(),
    effectiveDate: text("effective_date").notNull(),
    endDate: text("end_date"),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_compensation_employee_id").on(table.employeeId),
    index("idx_compensation_effective_date").on(table.effectiveDate),
  ]
);
