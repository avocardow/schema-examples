// providers: individuals who deliver bookable services.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const providers = pgTable(
  "providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    timezone: text("timezone").notNull(),
    phone: text("phone"),
    email: text("email"),
    isActive: boolean("is_active").notNull().default(true),
    isAccepting: boolean("is_accepting").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_providers_is_active_is_accepting").on(table.isActive, table.isAccepting),
    index("idx_providers_is_active_position").on(table.isActive, table.position),
  ]
);
