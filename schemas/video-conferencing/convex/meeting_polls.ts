// meeting_polls: polls created by hosts during a meeting for participant feedback.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const meetingPolls = defineTable({
  meetingId: v.id("meetings"),
  createdBy: v.id("users"),
  question: v.string(),
  options: v.any(),
  pollType: v.union(
    v.literal("single_choice"),
    v.literal("multiple_choice")
  ),
  status: v.union(
    v.literal("draft"),
    v.literal("active"),
    v.literal("closed")
  ),
  launchedAt: v.optional(v.number()),
  closedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_meeting_id_and_status", ["meetingId", "status"])
  .index("by_meeting_id_and_creation_time", ["meetingId", "_creationTime"]);
