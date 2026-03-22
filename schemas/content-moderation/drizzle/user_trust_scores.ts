// user_trust_scores: User reputation tracking in the moderation system.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  integer,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const trustLevelEnum = pgEnum("trust_level", [
  "new",
  "basic",
  "member",
  "trusted",
  "veteran",
]);

export const userTrustScores = pgTable(
  "user_trust_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .unique()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    trustLevel: trustLevelEnum("trust_level").notNull().default("new"),
    trustScore: numeric("trust_score").notNull().default("0.5"),
    totalReportsFiled: integer("total_reports_filed").notNull().default(0),
    reportsUpheld: integer("reports_upheld").notNull().default(0),
    reportsDismissed: integer("reports_dismissed").notNull().default(0),
    flagAccuracy: numeric("flag_accuracy").notNull().default("0.5"),
    contentViolations: integer("content_violations").notNull().default(0),
    lastViolationAt: timestamp("last_violation_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_user_trust_scores_trust_level").on(table.trustLevel),
    index("idx_user_trust_scores_trust_score").on(table.trustScore),
  ]
);
