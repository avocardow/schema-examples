// leave_requests: Employee leave/time-off requests with approval workflow and policy tracking.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { leavePolicies } from "./leave_policies";
import { users } from "./users";

export const leaveRequestStatusEnum = pgEnum("leave_request_status", [
  "pending",
  "approved",
  "rejected",
  "cancelled",
]);

export const leaveRequests = pgTable(
  "leave_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    leavePolicyId: uuid("leave_policy_id")
      .notNull()
      .references(() => leavePolicies.id, { onDelete: "restrict" }),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    daysRequested: numeric("days_requested").notNull(),
    status: leaveRequestStatusEnum("status").notNull().default("pending"),
    reason: text("reason"),
    reviewerId: uuid("reviewer_id")
      .references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewerNote: text("reviewer_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_leave_requests_employee_id").on(table.employeeId),
    index("idx_leave_requests_leave_policy_id").on(table.leavePolicyId),
    index("idx_leave_requests_status").on(table.status),
    index("idx_leave_requests_start_date").on(table.startDate),
  ]
);
