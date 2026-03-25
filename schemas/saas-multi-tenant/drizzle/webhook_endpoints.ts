// webhook_endpoints: Registered webhook delivery targets per organization with status tracking.
// See README.md for full schema documentation.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const webhookEndpointStatusEnum = pgEnum("webhook_endpoint_status", [
  "active",
  "paused",
  "disabled",
]);

export const webhookEndpoints = pgTable(
  "webhook_endpoints",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    description: text("description"),
    signingSecret: text("signing_secret").notNull(),
    status: webhookEndpointStatusEnum("status").notNull().default("active"),
    failureCount: integer("failure_count").notNull().default(0),
    lastSuccessAt: timestamp("last_success_at", { withTimezone: true }),
    lastFailureAt: timestamp("last_failure_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_webhook_endpoints_organization_id").on(table.organizationId),
    index("idx_webhook_endpoints_status").on(table.status),
  ]
);
