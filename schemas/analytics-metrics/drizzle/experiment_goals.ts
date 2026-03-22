// experiment_goals: Goals assigned to experiments with primary goal designation.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { experiments } from "./experiments";
import { goals } from "./goals";

export const experimentGoals = pgTable(
  "experiment_goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experimentId: uuid("experiment_id").notNull().references(() => experiments.id, { onDelete: "cascade" }),
    goalId: uuid("goal_id").notNull().references(() => goals.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_experiment_goals_experiment_id_goal_id").on(table.experimentId, table.goalId),
    index("idx_experiment_goals_goal_id").on(table.goalId),
  ]
);
