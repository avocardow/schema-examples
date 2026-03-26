// feedback: Buyer/seller ratings and comments for completed auctions.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { auctionWinners } from "./auction_winners";
import { users } from "../../auth-rbac/drizzle/users";

export const feedbackDirection = pgEnum("feedback_direction", ["buyer_to_seller", "seller_to_buyer"]);

export const feedback = pgTable(
  "feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auctionWinnerId: uuid("auction_winner_id").notNull().references(() => auctionWinners.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    direction: feedbackDirection("direction").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_feedback_auction_winner_id_direction").on(table.auctionWinnerId, table.direction),
    index("idx_feedback_recipient_id").on(table.recipientId),
    index("idx_feedback_author_id").on(table.authorId),
  ]
);
