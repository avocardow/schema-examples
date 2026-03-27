// rooms: virtual meeting rooms that can host one or more meetings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const rooms = defineTable({
  type: v.union(v.literal("permanent"), v.literal("temporary")),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  maxParticipants: v.optional(v.number()),
  enableWaitingRoom: v.boolean(),
  enableRecording: v.boolean(),
  enableChat: v.boolean(),
  enableTranscription: v.boolean(),
  enableBreakoutRooms: v.boolean(),
  isPrivate: v.boolean(),
  passwordHash: v.optional(v.string()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"])
  .index("by_type", ["type"])
  .index("by_is_private", ["isPrivate"])
  .index("by_slug", ["slug"]);
