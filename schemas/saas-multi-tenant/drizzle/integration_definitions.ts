// integration_definitions: Catalog of available third-party integrations and their configuration.
// See README.md for full schema documentation.

import { pgTable, pgEnum, uuid, text, boolean, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const integrationAuthMethodEnum = pgEnum("integration_auth_method", ["oauth2", "api_key", "webhook", "none"]);

export const integrationDefinitions = pgTable(
  "integration_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").unique().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    iconUrl: text("icon_url"),
    authMethod: integrationAuthMethodEnum("auth_method").notNull(),
    configSchema: jsonb("config_schema"),
    isEnabled: boolean("is_enabled").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_integration_definitions_is_enabled").on(table.isEnabled),
  ]
);
