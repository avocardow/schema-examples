// contacts: Stores email contacts with subscription status and metadata.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const contacts = defineTable({
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  status: v.union(
    v.literal("active"),
    v.literal("unsubscribed"),
    v.literal("bounced"),
    v.literal("complained")
  ),
  metadata: v.optional(v.any()),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_status", ["status"])
  .index("by_creation_time", ["_creationTime"]);
