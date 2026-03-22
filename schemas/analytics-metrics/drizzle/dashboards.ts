// dashboards: Configurable analytics dashboards with layout and refresh settings.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { visibilityEnum } from "./saved_reports";

export const dashboards = pgTable(
  "dashboards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    layout: jsonb("layout"),
    visibility: visibilityEnum("visibility").notNull().default("private"),
    isDefault: boolean("is_default").notNull().default(false),
    refreshInterval: integer("refresh_interval"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_dashboards_created_by").on(table.createdBy),
    index("idx_dashboards_visibility").on(table.visibility),
    index("idx_dashboards_is_default").on(table.isDefault),
  ]
);
