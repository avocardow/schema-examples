// auction_winners: Records the winning outcome of each auction including settlement tracking.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, integer, timestamp, text, index } from "drizzle-orm/pg-core";
import { auctions } from "./auctions";
import { bids } from "./bids";
import { users } from "../../auth-rbac/drizzle/users";

export const settlementStatus = pgEnum("settlement_status", ["pending", "paid", "shipped", "completed", "disputed", "refunded"]);

export const auctionWinners = pgTable(
  "auction_winners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auctionId: uuid("auction_id").unique().notNull().references(() => auctions.id, { onDelete: "restrict" }),
    winningBidId: uuid("winning_bid_id").unique().notNull().references(() => bids.id, { onDelete: "restrict" }),
    winnerId: uuid("winner_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    sellerId: uuid("seller_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    hammerPrice: integer("hammer_price").notNull(),
    buyerPremium: integer("buyer_premium").notNull().default(0),
    totalPrice: integer("total_price").notNull(),
    settlementStatus: settlementStatus("settlement_status").notNull().default("pending"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    shippedAt: timestamp("shipped_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_auction_winners_winner_id").on(table.winnerId),
    index("idx_auction_winners_seller_id").on(table.sellerId),
    index("idx_auction_winners_settlement_status").on(table.settlementStatus),
  ]
);
