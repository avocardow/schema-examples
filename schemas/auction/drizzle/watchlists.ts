// watchlists: Tracks auctions a user is watching for outbid/ending alerts.
// See README.md for full design rationale.

import { pgTable, uuid, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { auctions } from "./auctions";

export const watchlists = pgTable(
  "watchlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    auctionId: uuid("auction_id").notNull().references(() => auctions.id, { onDelete: "cascade" }),
    notifyOutbid: boolean("notify_outbid").notNull().default(true),
    notifyEnding: boolean("notify_ending").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_watchlists_user_id_auction_id").on(table.userId, table.auctionId),
    index("idx_watchlists_auction_id").on(table.auctionId),
  ]
);
