// auctions: Auction listings with bidding rules, pricing, and time extension settings.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const auctions = defineTable({
  itemId: v.id("items"),
  sellerId: v.id("users"),
  auctionType: v.union(v.literal("english"), v.literal("dutch"), v.literal("sealed_bid"), v.literal("buy_now_only")),
  status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("active"), v.literal("closing"), v.literal("closed"), v.literal("cancelled")),
  title: v.string(),
  description: v.optional(v.string()),
  startingPrice: v.number(),
  reservePrice: v.optional(v.number()),
  buyNowPrice: v.optional(v.number()),
  currentPrice: v.number(),
  bidCount: v.number(),
  highestBidderId: v.optional(v.id("users")),
  buyerPremiumPct: v.optional(v.number()),
  startTime: v.optional(v.number()),
  endTime: v.optional(v.number()),
  effectiveEndTime: v.optional(v.number()),
  extensionSeconds: v.number(),
  extensionWindowSeconds: v.number(),
  currency: v.string(),
  closedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_item_id", ["itemId"])
  .index("by_seller_id", ["sellerId"])
  .index("by_status", ["status"])
  .index("by_auction_type", ["auctionType"])
  .index("by_effective_end_time", ["effectiveEndTime"]);
