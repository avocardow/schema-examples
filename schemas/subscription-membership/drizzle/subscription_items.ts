// subscription_items: Line items within a subscription, linking to specific plan prices.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { subscriptions } from "./subscriptions";
import { planPrices } from "./plan_prices";

export const subscriptionItems = pgTable(
  "subscription_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    planPriceId: uuid("plan_price_id")
      .notNull()
      .references(() => planPrices.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull().default(1),
    metadata: jsonb("metadata"),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_subscription_items_subscription_price").on(table.subscriptionId, table.planPriceId),
    index("idx_subscription_items_plan_price_id").on(table.planPriceId),
  ]
);
