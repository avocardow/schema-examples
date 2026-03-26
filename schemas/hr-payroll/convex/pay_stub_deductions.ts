// pay_stub_deductions: Individual deduction line items on a pay stub,
// recording both employee and employer contribution amounts.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pay_stub_deductions = defineTable({
  payStubId: v.id("pay_stubs"),
  deductionTypeId: v.id("deduction_types"),
  employeeAmount: v.int64(),
  employerAmount: v.int64(),
})
  .index("by_pay_stub_id", ["payStubId"])
  .index("by_deduction_type_id", ["deductionTypeId"]);
