// conversations: core conversation records for direct messages, group chats, and channels.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversations = defineTable({
  type: v.union(v.literal("direct"), v.literal("group"), v.literal("channel")),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  slug: v.optional(v.string()),
  isPrivate: v.boolean(),
  isArchived: v.boolean(),
  lastMessageAt: v.optional(v.number()),
  messageCount: v.number(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_type", ["type"])
  .index("by_is_private_type", ["isPrivate", "type"])
  .index("by_created_by", ["createdBy"])
  .index("by_last_message_at", ["lastMessageAt"])
  .index("by_slug", ["slug"]);
