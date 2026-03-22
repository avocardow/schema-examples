// moderator_assignments: Default routing of content to moderators.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const moderator_assignments = defineTable({
  // Foreign keys
  moderatorId: v.id("users"), // The assigned moderator. Cascade: if moderator is deleted, their assignments are removed.

  // Scope — what this assignment covers
  scope: v.union(
    v.literal("community"),
    v.literal("channel"),
    v.literal("category")
  ),
  scopeId: v.string(), // ID of the community, channel, or violation category. String for external ID support.

  // Role — authority level within this assignment scope
  role: v.union(
    v.literal("moderator"),
    v.literal("senior_moderator"),
    v.literal("admin")
  ),

  isActive: v.boolean(), // Whether this assignment is currently active.
  assignedAt: v.number(), // Unix epoch ms. When this assignment was created.

  // Timestamps (only updatedAt — createdAt is auto via _creationTime)
  updatedAt: v.number(),
})
  .index("by_moderator_scope", ["moderatorId", "scope", "scopeId"])
  .index("by_scope", ["scope", "scopeId"])
  .index("by_moderator_id", ["moderatorId"])
  .index("by_is_active", ["isActive"]);
