// goals: Conversion goals defined by event, page view, or custom criteria.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { eventTypes } from "./event_types";

export const goalTypeEnum = pgEnum("goal_type", [
  "event",
  "page_view",
  "custom",
]);

export const goals = pgTable(
  "goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    goalType: goalTypeEnum("goal_type").notNull(),
    eventTypeId: uuid("event_type_id").references(() => eventTypes.id, { onDelete: "set null" }),
    urlPattern: text("url_pattern"),
    value: numeric("value"),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_goals_goal_type").on(table.goalType),
    index("idx_goals_event_type_id").on(table.eventTypeId),
    index("idx_goals_is_active").on(table.isActive),
    index("idx_goals_created_by").on(table.createdBy),
  ]
);
