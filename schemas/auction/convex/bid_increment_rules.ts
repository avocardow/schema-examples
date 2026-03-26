// bid_increment_rules: Tiered bidding increment rules based on price ranges.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bid_increment_rules = defineTable({
  auctionId: v.optional(v.id("auctions")),
  minPrice: v.number(),
  maxPrice: v.optional(v.number()),
  increment: v.number(),
})
  .index("by_auction_id", ["auctionId"])
  .index("by_min_price", ["minPrice"]);
