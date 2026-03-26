// feedback: Buyer and seller ratings exchanged after an auction concludes.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const feedback = defineTable({
  auctionWinnerId: v.id("auction_winners"),
  authorId: v.id("users"),
  recipientId: v.id("users"),
  direction: v.union(v.literal("buyer_to_seller"), v.literal("seller_to_buyer")),
  rating: v.number(),
  comment: v.optional(v.string()),
})
  .index("by_auction_winner_id_direction", ["auctionWinnerId", "direction"])
  .index("by_recipient_id", ["recipientId"])
  .index("by_author_id", ["authorId"]);
