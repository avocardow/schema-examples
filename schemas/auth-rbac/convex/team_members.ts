// team_members: Links users to teams within an organization.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const teamMembers = defineTable({
  teamId: v.id("teams"),
  userId: v.id("users"),
  role: v.optional(v.string()), // Simple team role (e.g., "lead", "member"). Not a FK.
})
  .index("by_team_id", ["teamId"])
  .index("by_user_id", ["userId"])
  .index("by_team_user", ["teamId", "userId"]);
