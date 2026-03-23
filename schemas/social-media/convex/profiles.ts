// profiles: user profile information including display details and social counters.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const profiles = defineTable({
  userId: v.id("users"),
  displayName: v.optional(v.string()),
  bio: v.optional(v.string()),
  avatarFileId: v.optional(v.id("files")),
  bannerFileId: v.optional(v.id("files")),
  website: v.optional(v.string()),
  location: v.optional(v.string()),
  isPrivate: v.boolean(),
  followerCount: v.number(),
  followingCount: v.number(),
  postCount: v.number(),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_is_private", ["isPrivate"]);
