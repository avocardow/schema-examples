// strikes: Accumulated violations with configurable expiry.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { moderationActions } from "./moderation_actions";
import { violationCategories } from "./violation_categories";

export const strikeSeverityEnum = pgEnum("strike_severity", [
  "minor",
  "moderate",
  "severe",
]);

export const strikeResolutionEnum = pgEnum("strike_resolution", [
  "active",
  "expired",
  "appealed_overturned",
]);

export const strikes = pgTable(
  "strikes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // The user who received the strike.
    moderationActionId: uuid("moderation_action_id")
      .notNull()
      .references(() => moderationActions.id, { onDelete: "restrict" }), // The action that generated this strike.
    violationCategoryId: uuid("violation_category_id").references(
      () => violationCategories.id,
      { onDelete: "set null" }
    ), // What type of violation the strike is for.
    severity: strikeSeverityEnum("severity").notNull().default("moderate"), // Strike weight. Severe strikes may count as 2 or 3.
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }), // When this strike expires. Null = never expires.
    isActive: boolean("is_active").notNull().default(true), // Whether this strike is currently counting.
    resolution: strikeResolutionEnum("resolution")
      .notNull()
      .default("active"), // active = counting, expired = past expiry, appealed_overturned = removed via appeal.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_strikes_user_active").on(table.userId, table.isActive), // All active strikes for this user — threshold check.
    index("idx_strikes_moderation_action").on(table.moderationActionId), // Strike for this action.
    index("idx_strikes_violation_category").on(table.violationCategoryId), // All strikes for a violation type.
    index("idx_strikes_expires_active").on(table.expiresAt, table.isActive), // Background job: expire strikes past their expiry date.
    index("idx_strikes_resolution").on(table.resolution), // All overturned strikes for reporting.
  ]
);
