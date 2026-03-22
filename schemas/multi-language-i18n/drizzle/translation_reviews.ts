// translation_reviews: Review actions taken on translations.
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const translationReviewActionEnum = pgEnum("translation_review_action", [
  "approve",
  "reject",
  "request_changes",
]);

export const translationReviews = pgTable(
  "translation_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    translationType: text("translation_type").notNull(),
    translationId: uuid("translation_id").notNull(),
    reviewerId: uuid("reviewer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: translationReviewActionEnum("action").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_translation_reviews_translation_type_translation_id").on(
      table.translationType,
      table.translationId
    ),
    index("idx_translation_reviews_reviewer_id").on(table.reviewerId),
  ]
);
