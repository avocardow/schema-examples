// auctions: Auction listings with type, pricing, timing, and anti-sniping controls.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, numeric, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { items } from "./items";

export const auctionType = pgEnum("auction_type", ["english", "dutch", "sealed_bid", "buy_now_only"]);

export const auctionStatus = pgEnum("auction_status", ["draft", "scheduled", "active", "closing", "closed", "cancelled"]);

export const auctions = pgTable(
  "auctions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "restrict" }),
    sellerId: uuid("seller_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    auctionType: auctionType("auction_type").notNull().default("english"),
    status: auctionStatus("status").notNull().default("draft"),
    title: text("title").notNull(),
    description: text("description"),
    startingPrice: numeric("starting_price").notNull(),
    reservePrice: numeric("reserve_price"),
    buyNowPrice: numeric("buy_now_price"),
    currentPrice: numeric("current_price").notNull().default("0"),
    bidCount: integer("bid_count").notNull().default(0),
    highestBidderId: uuid("highest_bidder_id").references(() => users.id, { onDelete: "set null" }),
    buyerPremiumPct: numeric("buyer_premium_pct"),
    startTime: timestamp("start_time", { withTimezone: true }),
    endTime: timestamp("end_time", { withTimezone: true }),
    effectiveEndTime: timestamp("effective_end_time", { withTimezone: true }),
    extensionSeconds: integer("extension_seconds").notNull().default(300),
    extensionWindowSeconds: integer("extension_window_seconds").notNull().default(300),
    currency: text("currency").notNull().default("USD"),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_auctions_item_id").on(table.itemId),
    index("idx_auctions_seller_id").on(table.sellerId),
    index("idx_auctions_status").on(table.status),
    index("idx_auctions_auction_type").on(table.auctionType),
    index("idx_auctions_effective_end_time").on(table.effectiveEndTime),
  ]
);
