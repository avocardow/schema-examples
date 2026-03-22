// user_moderation_notes: Internal moderator notes on user accounts.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const user_moderation_notes = defineTable({
  userId: v.string(), // FK → users. The user this note is about.
  authorId: v.string(), // FK → users. The moderator who wrote this note.
  body: v.string(), // The note text. Internal-only, never shown to the user.
  updatedAt: v.number(), // Unix epoch ms.
  // no createdAt — Convex provides _creationTime
})
  .index("by_user_id", ["userId"])
  .index("by_author_id", ["authorId"]);
