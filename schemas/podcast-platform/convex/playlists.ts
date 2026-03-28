// playlists: User-created episode collections with manual and smart playlist support.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const playlists = defineTable({
  userId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  playlistType: v.union(v.literal("manual"), v.literal("smart")),
  smartFilters: v.optional(v.any()),
  isPublic: v.boolean(),
  episodeCount: v.number(),
  updatedAt: v.number(),
}).index("by_user_id_creation_time", ["userId", "_creationTime"]);
