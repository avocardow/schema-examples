// customers: Billable entities linking users/organizations to payment providers.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { organizations } from "./organizations";

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    currency: text("currency"),
    taxId: text("tax_id"),
    metadata: jsonb("metadata"),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_customers_user_id").on(table.userId),
    index("idx_customers_organization_id").on(table.organizationId),
    index("idx_customers_provider").on(table.providerType, table.providerId),
  ]
);
