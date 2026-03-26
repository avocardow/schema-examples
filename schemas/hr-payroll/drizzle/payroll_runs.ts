// payroll_runs: Individual payroll execution cycles. Tracks gross, deductions, net totals and processing state for each pay period.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { paySchedules } from "./pay_schedules";
import { users } from "./users";

export const payrollRunStatusEnum = pgEnum("payroll_run_status", [
  "draft",
  "processing",
  "completed",
  "failed",
  "voided",
]);

export const payrollRuns = pgTable(
  "payroll_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    payScheduleId: uuid("pay_schedule_id")
      .notNull()
      .references(() => paySchedules.id, { onDelete: "restrict" }),

    // Pay period boundaries and payment date.
    periodStart: text("period_start").notNull(),
    periodEnd: text("period_end").notNull(),
    payDate: text("pay_date").notNull(),

    status: payrollRunStatusEnum("status").notNull().default("draft"),

    // Financial totals (stored as smallest currency unit, e.g. cents).
    totalGross: integer("total_gross").notNull().default(0),
    totalDeductions: integer("total_deductions").notNull().default(0),
    totalNet: integer("total_net").notNull().default(0),
    employeeCount: integer("employee_count").notNull().default(0),

    currency: text("currency").notNull().default("USD"),

    // Processing metadata.
    processedAt: timestamp("processed_at", { withTimezone: true }),
    processedBy: uuid("processed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_payroll_runs_pay_schedule_id").on(table.payScheduleId),
    index("idx_payroll_runs_status").on(table.status),
    index("idx_payroll_runs_pay_date").on(table.payDate),
  ]
);
