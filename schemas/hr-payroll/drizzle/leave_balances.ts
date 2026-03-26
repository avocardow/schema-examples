// leave_balances: Tracks employee leave entitlements, accruals, and usage per policy per year.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  numeric,
  integer,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { leavePolicies } from "./leave_policies";

export const leaveBalances = pgTable(
  "leave_balances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    leavePolicyId: uuid("leave_policy_id")
      .notNull()
      .references(() => leavePolicies.id, { onDelete: "cascade" }),
    balance: numeric("balance").notNull().default("0"),
    accrued: numeric("accrued").notNull().default("0"),
    used: numeric("used").notNull().default("0"),
    carriedOver: numeric("carried_over").notNull().default("0"),
    year: integer("year").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_leave_balances_employee_policy_year").on(table.employeeId, table.leavePolicyId, table.year),
    index("idx_leave_balances_leave_policy_id").on(table.leavePolicyId),
  ]
);
