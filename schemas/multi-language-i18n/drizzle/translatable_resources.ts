// translatable_resources: Resource type definitions for content translation.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const translatableResources = pgTable(
  "translatable_resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resourceType: text("resource_type").unique().notNull(),
    displayName: text("display_name").notNull(),
    translatableFields: jsonb("translatable_fields").notNull(),
    description: text("description"),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }
);
