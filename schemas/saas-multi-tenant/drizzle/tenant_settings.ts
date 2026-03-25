// tenant_settings: Per-tenant key-value configuration overrides.
// See README.md for full schema documentation.

import { pgTable, uuid, varchar, text, timestamp, unique } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const tenantSettings = pgTable(
  "tenant_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 255 }).notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    unique("uq_tenant_settings_organization_id_key").on(table.organizationId, table.key),
  ]
);
