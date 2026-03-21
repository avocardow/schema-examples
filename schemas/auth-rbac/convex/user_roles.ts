// user_roles: Assigns roles to users at the environment (app-wide) level.
// For organization-scoped roles, see organization_members.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userRoles = defineTable({
  userId: v.id("users"),
  roleId: v.id("roles"),
  assignedBy: v.optional(v.id("users")), // Who granted this role. Null if system-assigned.
})
  .index("by_user_id", ["userId"])
  .index("by_role_id", ["roleId"])
  .index("by_user_role", ["userId", "roleId"]);
