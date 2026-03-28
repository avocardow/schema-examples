// artists: musical artists with profile details and popularity metrics.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const artists = defineTable({
  name: v.string(),
  slug: v.string(),
  bio: v.optional(v.string()),
  imageFileId: v.optional(v.id("files")),
  bannerFileId: v.optional(v.id("files")),
  isVerified: v.boolean(),
  followerCount: v.number(),
  monthlyListeners: v.number(),
  popularity: v.number(),
  externalUrl: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_popularity", ["popularity"])
  .index("by_name", ["name"]);
