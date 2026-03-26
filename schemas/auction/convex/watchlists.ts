// watchlists: Tracks auctions a user is watching, with notification preferences.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const watchlists = defineTable({
  userId: v.id("users"),
  auctionId: v.id("auctions"),
  notifyOutbid: v.boolean(),
  notifyEnding: v.boolean(),
})
  .index("by_user_id_auction_id", ["userId", "auctionId"])
  .index("by_auction_id", ["auctionId"]);
