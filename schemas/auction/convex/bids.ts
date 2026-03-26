// bids: Auction bid tracking with proxy bidding support and status lifecycle.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bids = defineTable({
  auctionId: v.id("auctions"),
  bidderId: v.id("users"),
  amount: v.number(),
  maxAmount: v.optional(v.number()),
  status: v.union(v.literal("active"), v.literal("outbid"), v.literal("winning"), v.literal("won"), v.literal("cancelled")),
  isProxy: v.boolean(),
  ipAddress: v.optional(v.string()),
})
  .index("by_auction_id", ["auctionId"])
  .index("by_bidder_id", ["bidderId"])
  .index("by_auction_id_amount", ["auctionId", "amount"])
  .index("by_status", ["status"]);
