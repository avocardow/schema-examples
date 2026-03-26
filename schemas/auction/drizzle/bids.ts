// bids: Records placed on auctions, supporting proxy bidding and status tracking.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, numeric, boolean, varchar, timestamp, index, unique } from "drizzle-orm/pg-core";
import { auctions } from "./auctions";
import { users } from "../../auth-rbac/drizzle/users";

export const bidStatus = pgEnum("bid_status", ["active", "outbid", "winning", "won", "cancelled"]);

export const bids = pgTable(
  "bids",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auctionId: uuid("auction_id").notNull().references(() => auctions.id, { onDelete: "restrict" }),
    bidderId: uuid("bidder_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    amount: numeric("amount").notNull(),
    maxAmount: numeric("max_amount"),
    status: bidStatus("status").notNull().default("active"),
    isProxy: boolean("is_proxy").notNull().default(false),
    ipAddress: varchar("ip_address"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_bids_auction_id_amount").on(table.auctionId, table.amount),
    index("idx_bids_bidder_id").on(table.bidderId),
    index("idx_bids_status").on(table.status),
  ]
);
