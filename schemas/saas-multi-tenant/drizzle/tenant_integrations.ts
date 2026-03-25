// tenant_integrations: Third-party integrations connected to tenant organizations with credentials, config, and sync tracking.
// See README.md for full schema documentation.

import { pgTable, pgEnum, uuid, jsonb, text, timestamp, unique, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { integrationDefinitions } from "./integration_definitions";
import { users } from "./users";

export const tenantIntegrationStatusEnum = pgEnum("tenant_integration_status", [
  "active",
  "inactive",
  "error",
]);

export const tenantIntegrations = pgTable(
  "tenant_integrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    integrationId: uuid("integration_id")
      .notNull()
      .references(() => integrationDefinitions.id, { onDelete: "restrict" }),
    status: tenantIntegrationStatusEnum("status").notNull().default("active"),
    encryptedCredentials: jsonb("encrypted_credentials"),
    config: jsonb("config"),
    connectedBy: uuid("connected_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    unique("uq_tenant_integrations_organization_id_integration_id").on(table.organizationId, table.integrationId),
    index("idx_tenant_integrations_integration_id").on(table.integrationId),
    index("idx_tenant_integrations_status").on(table.status),
  ]
);
