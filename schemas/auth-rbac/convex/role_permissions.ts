// role_permissions: Junction table linking roles to permissions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const rolePermissions = defineTable({
  roleId: v.id("roles"),
  permissionId: v.id("permissions"),
})
  .index("by_role_id", ["roleId"])
  .index("by_permission_id", ["permissionId"])
  .index("by_role_permission", ["roleId", "permissionId"]);
