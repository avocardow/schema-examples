// follow_requests: pending follow requests for private profiles with approval workflow.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const followRequests = defineTable({
  requesterId: v.id("users"),
  targetId: v.id("users"),
  status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  updatedAt: v.number(),
})
  .index("by_requester_id_target_id", ["requesterId", "targetId"])
  .index("by_target_id_status", ["targetId", "status"]);
