// recording_access_grants: permissions granting users access to specific recordings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recordingAccessGrants = defineTable({
  recordingId: v.id("recordings"),
  grantedTo: v.id("users"),
  grantedBy: v.id("users"),
  permission: v.union(v.literal("view"), v.literal("download")),
  expiresAt: v.optional(v.number()),
})
  .index("by_recording_id_and_granted_to", ["recordingId", "grantedTo"])
  .index("by_granted_to", ["grantedTo"]);
