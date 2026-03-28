// reviews: User ratings and reviews for shows.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const reviews = defineTable({
  userId: v.id("users"),
  showId: v.id("shows"),
  rating: v.number(),
  title: v.optional(v.string()),
  body: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_user_id_show_id", ["userId", "showId"])
  .index("by_show_id_creation_time", ["showId", "_creationTime"])
  .index("by_show_id_rating", ["showId", "rating"]);
