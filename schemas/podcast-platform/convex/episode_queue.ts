// episode_queue: User's up-next episode queue with ordering.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const episode_queue = defineTable({
  userId: v.id("users"),
  episodeId: v.id("episodes"),
  position: v.number(),
})
  .index("by_user_id_episode_id", ["userId", "episodeId"])
  .index("by_user_id_position", ["userId", "position"]);
