// saved_reports: User-created report configurations with visibility controls.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const visibilityEnum = pgEnum("visibility", [
  "private",
  "team",
  "public",
]);

export const savedReports = pgTable(
  "saved_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    config: jsonb("config").notNull(),
    visibility: visibilityEnum("visibility").notNull().default("private"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_saved_reports_created_by").on(table.createdBy),
    index("idx_saved_reports_visibility").on(table.visibility),
  ]
);
