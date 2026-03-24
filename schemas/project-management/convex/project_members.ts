// projectMembers: tracks user membership and roles within projects.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const projectMembers = defineTable({
  projectId: v.id("projects"),
  userId: v.id("users"),
  role: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("member"),
    v.literal("viewer")
  ),
  updatedAt: v.number(),
})
  .index("by_project_id_user_id", ["projectId", "userId"])
  .index("by_user_id", ["userId"]);
