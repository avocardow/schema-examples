// appeals: User appeals against moderation actions.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { moderationActions } from "./moderation_actions";
import { users } from "../../auth-rbac/drizzle/users";

export const appealStatusEnum = pgEnum("appeal_status", [
  "pending",
  "approved",
  "rejected",
]);

export const appeals = pgTable(
  "appeals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moderationActionId: uuid("moderation_action_id")
      .notNull()
      .unique()
      .references(() => moderationActions.id, { onDelete: "restrict" }), // One appeal per action. Restrict: cannot delete an action with an active appeal.
    appellantId: uuid("appellant_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Who submitted the appeal.
    appealText: text("appeal_text").notNull(), // The user's explanation of why the action should be overturned.
    status: appealStatusEnum("status").notNull().default("pending"), // pending = awaiting review, approved = overturned, rejected = upheld.
    reviewerId: uuid("reviewer_id").references(() => users.id, {
      onDelete: "set null",
    }), // Moderator who reviewed the appeal. Null = pending.
    reviewerNotes: text("reviewer_notes"), // Internal notes on the appeal decision.
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }), // When the appeal was decided. Null = pending.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_appeals_appellant_id").on(table.appellantId),
    index("idx_appeals_status").on(table.status),
    index("idx_appeals_reviewer_id").on(table.reviewerId),
    index("idx_appeals_created_at").on(table.createdAt),
  ]
);
