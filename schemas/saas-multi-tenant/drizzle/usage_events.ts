// usage_events: Append-only log of metered feature usage per organization.
// See README.md for full schema documentation.

import {
  pgTable,
  uuid,
  integer,
  varchar,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { features } from "./features";
import { users } from "./users";

export const usageEvents = pgTable(
  "usage_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    featureId: uuid("feature_id")
      .notNull()
      .references(() => features.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    metadata: jsonb("metadata"),
    idempotencyKey: varchar("idempotency_key", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_usage_events_org_feature_created").on(
      table.organizationId,
      table.featureId,
      table.createdAt
    ),
    index("idx_usage_events_idempotency_key").on(table.idempotencyKey),
  ]
);
