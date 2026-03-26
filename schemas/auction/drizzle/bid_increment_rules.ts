// bid_increment_rules: Defines price-range-based bid increment tiers for auctions.
// See README.md for full design rationale.

import { pgTable, uuid, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { auctions } from "./auctions";

export const bidIncrementRules = pgTable(
  "bid_increment_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auctionId: uuid("auction_id").references(() => auctions.id, { onDelete: "cascade" }),
    minPrice: numeric("min_price").notNull(),
    maxPrice: numeric("max_price"),
    increment: numeric("increment").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_bid_increment_rules_auction_id").on(table.auctionId),
    index("idx_bid_increment_rules_min_price").on(table.minPrice),
  ]
);
