// control_tests: Records of periodic control testing and their results.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const controlTests = defineTable({
  controlId: v.id("controls"),
  testedBy: v.optional(v.id("users")),
  testDate: v.number(),
  result: v.union(
    v.literal("pass"),
    v.literal("fail"),
    v.literal("partial"),
    v.literal("not_applicable")
  ),
  notes: v.optional(v.string()),
  nextTestDate: v.optional(v.number()),
})
  .index("by_control_id", ["controlId"])
  .index("by_tested_by", ["testedBy"])
  .index("by_result", ["result"])
  .index("by_test_date", ["testDate"]);
