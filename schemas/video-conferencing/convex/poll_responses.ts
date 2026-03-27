// poll_responses: individual participant responses to meeting polls.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pollResponses = defineTable({
  pollId: v.id("meeting_polls"),
  userId: v.id("users"),
  selectedOptions: v.any(),
  updatedAt: v.number(),
})
  .index("by_poll_id_and_user_id", ["pollId", "userId"])
  .index("by_user_id", ["userId"]);
