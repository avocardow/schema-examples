// session_speakers: many-to-many link between sessions and speakers with role assignments.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const session_speakers = defineTable({
  sessionId: v.id("event_sessions"),
  speakerId: v.id("speakers"),
  role: v.union(
    v.literal("speaker"),
    v.literal("moderator"),
    v.literal("panelist"),
    v.literal("host"),
    v.literal("keynote")
  ),
  position: v.number(),
})
  .index("by_session_id_speaker_id", ["sessionId", "speakerId"])
  .index("by_speaker_id", ["speakerId"]);
