// experiment_assignments: User-to-variant assignments for experiment participation tracking.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { experiments } from "./experiments";
import { experimentVariants } from "./experiment_variants";

export const experimentAssignments = pgTable(
  "experiment_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experimentId: uuid("experiment_id").notNull().references(() => experiments.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").notNull().references(() => experimentVariants.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    anonymousId: text("anonymous_id"),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_experiment_assignments_experiment_id_user_id").on(table.experimentId, table.userId),
    index("idx_experiment_assignments_experiment_id_variant_id").on(table.experimentId, table.variantId),
    index("idx_experiment_assignments_user_id").on(table.userId),
    index("idx_experiment_assignments_assigned_at").on(table.assignedAt),
  ]
);
