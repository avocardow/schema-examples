// people: podcast hosts, guests, and contributors with profile metadata.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const people = defineTable({
  name: v.string(),
  slug: v.string(),
  bio: v.optional(v.string()),
  url: v.optional(v.string()),
  imageFileId: v.optional(v.id("files")),
  podcastIndexId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_name", ["name"]);
