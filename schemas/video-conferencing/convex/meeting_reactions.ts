// meeting_reactions: ephemeral emoji reactions sent by participants during a meeting.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const meetingReactions = defineTable({
  meetingId: v.id("meetings"),
  userId: v.id("users"),
  emoji: v.string(),
})
  .index("by_meeting_id_and_creation_time", ["meetingId", "_creationTime"])
  .index("by_meeting_id_and_emoji", ["meetingId", "emoji"]);
