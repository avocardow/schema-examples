// speakers: presenter profiles with contact and social media details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const speakers = defineTable({
  userId: v.optional(v.id("users")),
  name: v.string(),
  email: v.optional(v.string()),
  bio: v.optional(v.string()),
  title: v.optional(v.string()),
  company: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  twitterHandle: v.optional(v.string()),
  linkedinUrl: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_is_active", ["isActive"]);
