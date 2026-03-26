// auction_winners: Records of winning bids and settlement tracking for completed auctions.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const auction_winners = defineTable({
  auctionId: v.id("auctions"),
  winningBidId: v.id("bids"),
  winnerId: v.id("users"),
  sellerId: v.id("users"),
  hammerPrice: v.number(),
  buyerPremium: v.number(),
  totalPrice: v.number(),
  settlementStatus: v.union(
    v.literal("pending"),
    v.literal("paid"),
    v.literal("shipped"),
    v.literal("completed"),
    v.literal("disputed"),
    v.literal("refunded")
  ),
  paidAt: v.optional(v.number()),
  shippedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  notes: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_auction_id", ["auctionId"])
  .index("by_winning_bid_id", ["winningBidId"])
  .index("by_winner_id", ["winnerId"])
  .index("by_seller_id", ["sellerId"])
  .index("by_settlement_status", ["settlementStatus"]);
