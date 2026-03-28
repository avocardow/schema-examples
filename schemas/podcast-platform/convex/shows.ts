// shows: podcast shows with metadata, feed details, and audience metrics.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const shows = defineTable({
  ownerId: v.id("users"),
  networkId: v.optional(v.id("networks")),
  title: v.string(),
  slug: v.string(),
  description: v.string(),
  htmlDescription: v.optional(v.string()),
  author: v.string(),
  language: v.string(),
  showType: v.union(v.literal("episodic"), v.literal("serial")),
  explicit: v.boolean(),
  artworkFileId: v.optional(v.id("files")),
  bannerFileId: v.optional(v.id("files")),
  feedUrl: v.optional(v.string()),
  website: v.optional(v.string()),
  copyright: v.optional(v.string()),
  ownerName: v.optional(v.string()),
  ownerEmail: v.optional(v.string()),
  podcastGuid: v.optional(v.string()),
  medium: v.union(
    v.literal("podcast"),
    v.literal("music"),
    v.literal("video"),
    v.literal("audiobook"),
    v.literal("newsletter")
  ),
  isComplete: v.boolean(),
  episodeCount: v.number(),
  subscriberCount: v.number(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_owner_id", ["ownerId"])
  .index("by_network_id", ["networkId"])
  .index("by_language_and_show_type", ["language", "showType"])
  .index("by_subscriber_count", ["subscriberCount"]);
