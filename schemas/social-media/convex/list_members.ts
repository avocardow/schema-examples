// list_members: junction table tracking which users belong to which lists.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const listMembers = defineTable({
  listId: v.id("lists"),
  userId: v.id("users"),
})
  .index("by_list_id_user_id", ["listId", "userId"])
  .index("by_user_id", ["userId"]);
