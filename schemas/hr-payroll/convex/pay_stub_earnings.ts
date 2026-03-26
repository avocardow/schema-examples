// pay_stub_earnings: Individual earning line items recorded on each pay stub.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pay_stub_earnings = defineTable({
  payStubId: v.id("pay_stubs"),
  earningTypeId: v.id("earning_types"),
  hours: v.optional(v.float64()),
  rate: v.optional(v.int64()),
  amount: v.int64(),
})
  .index("by_pay_stub_id", ["payStubId"])
  .index("by_earning_type_id", ["earningTypeId"]);
