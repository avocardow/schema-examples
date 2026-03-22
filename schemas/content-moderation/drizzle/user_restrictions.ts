// user_restrictions: Active restrictions on user accounts.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { moderationActions } from "./moderation_actions";

export const userRestrictionType = pgEnum("user_restriction_type", [
  "ban",
  "mute",
  "post_restriction",
  "shadow_ban",
  "warning",
  "probation",
]);

export const userRestrictionScope = pgEnum("user_restriction_scope", [
  "global",
  "community",
  "channel",
]);

export const userRestrictions = pgTable(
  "user_restrictions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // The restricted user.
    restrictionType: userRestrictionType("restriction_type").notNull(),
    scope: userRestrictionScope("scope").notNull().default("global"), // Where the restriction applies.
    scopeId: text("scope_id"), // Community/channel ID. Null when scope = global.
    reason: text("reason"), // Why the restriction was imposed.
    moderationActionId: uuid("moderation_action_id").references(
      () => moderationActions.id,
      { onDelete: "set null" }
    ), // The moderation action that created this restriction.
    imposedBy: uuid("imposed_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Moderator who imposed the restriction.
    imposedAt: timestamp("imposed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }), // Null = permanent.
    isActive: boolean("is_active").notNull().default(true), // Whether the restriction is currently in effect.
    liftedBy: uuid("lifted_by").references(() => users.id, {
      onDelete: "set null",
    }), // Moderator who lifted the restriction early.
    liftedAt: timestamp("lifted_at", { withTimezone: true }), // Null = still active or expired.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_user_restrictions_user_active").on(table.userId, table.isActive),
    index("idx_user_restrictions_type").on(table.restrictionType),
    index("idx_user_restrictions_scope").on(table.scope, table.scopeId),
    index("idx_user_restrictions_expires_active").on(
      table.expiresAt,
      table.isActive
    ),
    index("idx_user_restrictions_imposed_by").on(table.imposedBy),
  ]
);
