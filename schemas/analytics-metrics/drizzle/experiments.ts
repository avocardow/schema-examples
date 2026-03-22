// experiments: A/B test experiments with traffic allocation and lifecycle tracking.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const experimentStatusEnum = pgEnum("experiment_status", [
  "draft",
  "running",
  "paused",
  "completed",
]);

export const experiments = pgTable(
  "experiments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    hypothesis: text("hypothesis"),
    status: experimentStatusEnum("status").notNull().default("draft"),
    trafficPercentage: numeric("traffic_percentage").notNull().default("1.0"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_experiments_status").on(table.status),
    index("idx_experiments_created_by").on(table.createdBy),
  ]
);
