// moderator_assignments: Default routing of content to moderators.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const moderatorAssignmentScopeEnum = pgEnum(
  "moderator_assignment_scope",
  ["community", "channel", "category"]
);

export const moderatorAssignmentRoleEnum = pgEnum(
  "moderator_assignment_role",
  ["moderator", "senior_moderator", "admin"]
);

export const moderatorAssignments = pgTable(
  "moderator_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    moderatorId: uuid("moderator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // The assigned moderator. Cascade: if moderator is deleted, their assignments are removed.

    scope: moderatorAssignmentScopeEnum("scope").notNull(),
    // What this assignment covers.
    // community = moderator handles a specific community.
    // channel = moderator handles a specific channel.
    // category = moderator handles a specific violation category.

    scopeId: text("scope_id").notNull(), // ID of the community, channel, or violation category. String for external ID support.

    role: moderatorAssignmentRoleEnum("role").notNull().default("moderator"),
    // Authority level within this assignment scope.
    // moderator = standard moderation powers.
    // senior_moderator = can handle escalations, override decisions.
    // admin = full authority including moderator management.

    isActive: boolean("is_active").notNull().default(true), // Whether this assignment is currently active.

    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .notNull()
      .defaultNow(), // When this assignment was created.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_moderator_assignments_moderator_scope").on(
      table.moderatorId,
      table.scope,
      table.scopeId
    ), // One assignment per moderator per scope entity.
    index("idx_moderator_assignments_scope").on(table.scope, table.scopeId), // "All moderators for this community."
    index("idx_moderator_assignments_is_active").on(table.isActive), // "All active assignments."
  ]
);
