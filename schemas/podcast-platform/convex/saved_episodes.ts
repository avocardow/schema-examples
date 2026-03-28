// saved_episodes: Individually saved or bookmarked episodes by users.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const saved_episodes = defineTable({
  userId: v.id("users"),
  episodeId: v.id("episodes"),
})
  .index("by_user_id_creation_time", ["userId", "_creationTime"])
  .index("by_user_id_episode_id", ["userId", "episodeId"]);
