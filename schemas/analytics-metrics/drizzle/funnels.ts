// funnels: Multi-step conversion funnels with configurable time windows.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const funnels = pgTable(
  "funnels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    conversionWindow: integer("conversion_window").notNull().default(86400),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_funnels_is_active").on(table.isActive),
    index("idx_funnels_created_by").on(table.createdBy),
  ]
);
