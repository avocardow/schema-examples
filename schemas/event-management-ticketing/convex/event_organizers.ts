// event_organizers: users assigned to manage or staff an event with specific roles.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const event_organizers = defineTable({
  eventId: v.id("events"),
  userId: v.id("users"),
  role: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("moderator"),
    v.literal("check_in_staff")
  ),
})
  .index("by_event_id_user_id", ["eventId", "userId"])
  .index("by_user_id", ["userId"]);
