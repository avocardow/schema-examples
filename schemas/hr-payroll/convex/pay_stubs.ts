// pay_stubs: Individual pay statement for an employee within a payroll run.
// Monetary amounts stored as integers (cents) to avoid floating-point rounding.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pay_stubs = defineTable({
  payrollRunId: v.id("payroll_runs"), // The payroll run this stub belongs to. Cascade: delete run → delete stubs.
  employeeId: v.id("employees"), // The employee this stub is for. Cascade: delete employee → delete stubs.

  grossPay: v.int64(), // Total earnings before deductions, in smallest currency unit.
  totalDeductions: v.int64(), // Sum of all deductions (taxes, benefits, etc.), in smallest currency unit.
  netPay: v.int64(), // Take-home pay (grossPay − totalDeductions), in smallest currency unit.

  currency: v.string(), // ISO 4217 currency code, e.g. "USD".

  payDate: v.string(), // Date the payment was issued (ISO 8601 date string).
  periodStart: v.string(), // First day of the pay period (ISO 8601 date string).
  periodEnd: v.string(), // Last day of the pay period (ISO 8601 date string).
})
  .index("by_payroll_run_and_employee", ["payrollRunId", "employeeId"])
  .index("by_employee_id", ["employeeId"])
  .index("by_pay_date", ["payDate"]);
