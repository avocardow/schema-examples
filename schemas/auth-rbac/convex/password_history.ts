// password_history: Previous password hashes for enterprise password-reuse policies.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const passwordHistory = defineTable({
  userId: v.id("users"),
  passwordHash: v.string(), // The previous password hash. Compared against new passwords to prevent reuse.
})
  .index("by_user_id_creation", ["userId", "_creationTime"]);
