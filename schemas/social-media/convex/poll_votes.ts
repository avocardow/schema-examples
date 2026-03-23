// poll_votes: individual vote records linking users to poll option choices.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pollVotes = defineTable({
  pollId: v.id("polls"),
  userId: v.id("users"),
  optionIndex: v.number(),
})
  .index("by_poll_id_user_id_option_index", ["pollId", "userId", "optionIndex"])
  .index("by_user_id", ["userId"]);
