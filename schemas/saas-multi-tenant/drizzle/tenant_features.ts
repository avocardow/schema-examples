// tenant_features: Maps features to organizations with enablement, limits, source, and expiry.
// See README.md for full schema documentation.

import { pgTable, pgEnum, uuid, boolean, integer, text, timestamp, unique, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { features } from "./features";

export const tenantFeatureSourceEnum = pgEnum("tenant_feature_source", [
  "plan",
  "override",
  "trial",
  "custom",
]);

export const tenantFeatures = pgTable(
  "tenant_features",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    featureId: uuid("feature_id")
      .notNull()
      .references(() => features.id, { onDelete: "cascade" }),
    isEnabled: boolean("is_enabled").notNull().default(true),
    limitValue: integer("limit_value"),
    source: tenantFeatureSourceEnum("source").notNull().default("plan"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    unique("uq_tenant_features_organization_id_feature_id").on(table.organizationId, table.featureId),
    index("idx_tenant_features_feature_id").on(table.featureId),
    index("idx_tenant_features_source").on(table.source),
    index("idx_tenant_features_expires_at").on(table.expiresAt),
  ]
);
