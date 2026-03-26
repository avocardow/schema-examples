// pay_stubs: Individual pay statements per employee per payroll run, with gross/net/deduction totals.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { payrollRuns } from "./payroll_runs";
import { employees } from "./employees";

export const payStubs = pgTable(
  "pay_stubs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    payrollRunId: uuid("payroll_run_id")
      .notNull()
      .references(() => payrollRuns.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    grossPay: integer("gross_pay").notNull().default(0),
    totalDeductions: integer("total_deductions").notNull().default(0),
    netPay: integer("net_pay").notNull().default(0),
    currency: text("currency").notNull().default("USD"),
    payDate: text("pay_date").notNull(),
    periodStart: text("period_start").notNull(),
    periodEnd: text("period_end").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_pay_stubs_payroll_run_employee").on(table.payrollRunId, table.employeeId),
    index("idx_pay_stubs_employee_id").on(table.employeeId),
    index("idx_pay_stubs_pay_date").on(table.payDate),
  ]
);
