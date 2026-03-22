// moderator_performance: Pre-aggregated moderator performance metrics.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  integer,
  numeric,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const moderatorPerformance = pgTable(
  "moderator_performance",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    moderatorId: uuid("moderator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),

    itemsReviewed: integer("items_reviewed").notNull().default(0),
    itemsActioned: integer("items_actioned").notNull().default(0),
    averageReviewTimeSeconds: integer("average_review_time_seconds")
      .notNull()
      .default(0),
    appealsOverturned: integer("appeals_overturned").notNull().default(0),
    accuracyScore: numeric("accuracy_score").notNull().default("1.0"),

    computedAt: timestamp("computed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("uq_moderator_performance_moderator_period").on(
      table.moderatorId,
      table.periodStart,
      table.periodEnd
    ),
    index("idx_moderator_performance_period").on(
      table.periodStart,
      table.periodEnd
    ),
  ]
);
