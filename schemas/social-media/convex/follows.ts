// follows: follower-following relationships between users with notification preferences.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const follows = defineTable({
  followerId: v.id("users"),
  followingId: v.id("users"),
  notify: v.boolean(),
  showReposts: v.boolean(),
})
  .index("by_follower_id_following_id", ["followerId", "followingId"])
  .index("by_following_id", ["followingId"]);
