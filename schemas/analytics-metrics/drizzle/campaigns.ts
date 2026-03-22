// campaigns: Marketing campaign tracking with UTM parameters.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    source: text("source").notNull(),
    medium: text("medium").notNull(),
    term: text("term"),
    content: text("content"),
    landingUrl: text("landing_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_campaigns_source_medium_name").on(table.source, table.medium, table.name),
    index("idx_campaigns_is_active").on(table.isActive),
    index("idx_campaigns_created_by").on(table.createdBy),
  ]
);
