// organization_members: Links users to organizations with a role.
// Primary multi-tenancy junction table.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizationMembers = defineTable({
  organizationId: v.id("organizations"),
  userId: v.id("users"),
  roleId: v.id("roles"), // Must be a role with scope=organization.

  status: v.union(v.literal("active"), v.literal("inactive")),

  directoryManaged: v.boolean(), // If true, managed by external directory (SCIM).
  customAttributes: v.optional(v.any()), // Org-specific metadata for this member.
  invitedBy: v.optional(v.id("users")),
  joinedAt: v.optional(v.number()), // When the user accepted the invitation.
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_org_status", ["organizationId", "status"])
  .index("by_org_user", ["organizationId", "userId"]);
