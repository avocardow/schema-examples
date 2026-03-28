// episodes: individual podcast episodes with audio, metadata, and feed enclosure details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const episodes = defineTable({
  showId: v.id("shows"),
  title: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  htmlDescription: v.optional(v.string()),
  episodeType: v.union(
    v.literal("full"),
    v.literal("trailer"),
    v.literal("bonus")
  ),
  seasonNumber: v.optional(v.number()),
  episodeNumber: v.optional(v.number()),
  durationMs: v.number(),
  explicit: v.boolean(),
  audioFileId: v.optional(v.id("files")),
  artworkFileId: v.optional(v.id("files")),
  enclosureUrl: v.optional(v.string()),
  enclosureLength: v.optional(v.number()),
  enclosureType: v.optional(v.string()),
  guid: v.optional(v.string()),
  publishedAt: v.optional(v.number()),
  isBlocked: v.boolean(),
  playCount: v.number(),
  updatedAt: v.number(),
})
  .index("by_show_id_and_published_at", ["showId", "publishedAt"])
  .index("by_show_id_season_number_episode_number", [
    "showId",
    "seasonNumber",
    "episodeNumber",
  ])
  .index("by_published_at", ["publishedAt"])
  .index("by_guid", ["guid"])
  .index("by_show_id_slug", ["showId", "slug"]);
