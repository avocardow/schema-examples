// pay_stub_deductions: Individual deduction line items on each pay stub.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { payStubs } from "./pay_stubs";
import { deductionTypes } from "./deduction_types";

export const payStubDeductions = pgTable(
  "pay_stub_deductions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    payStubId: uuid("pay_stub_id")
      .notNull()
      .references(() => payStubs.id, { onDelete: "cascade" }),
    deductionTypeId: uuid("deduction_type_id")
      .notNull()
      .references(() => deductionTypes.id, { onDelete: "restrict" }),
    employeeAmount: integer("employee_amount").notNull().default(0),
    employerAmount: integer("employer_amount").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_pay_stub_deductions_pay_stub_id").on(table.payStubId),
    index("idx_pay_stub_deductions_deduction_type_id").on(table.deductionTypeId),
  ]
);
