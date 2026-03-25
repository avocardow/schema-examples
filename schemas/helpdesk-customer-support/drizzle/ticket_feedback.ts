// ticket_feedback: per-ticket customer satisfaction rating with optional comment.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { users } from "./users";

export const ticketFeedbackRatingEnum = pgEnum("ticket_feedback_rating", [
  "good",
  "bad",
]);

export const ticketFeedback = pgTable(
  "ticket_feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id").notNull().unique().references(() => tickets.id, { onDelete: "cascade" }),
    rating: ticketFeedbackRatingEnum("rating").notNull(),
    comment: text("comment"),
    createdById: uuid("created_by_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_ticket_feedback_rating").on(table.rating),
    index("idx_ticket_feedback_created_by_id").on(table.createdById),
  ]
);
