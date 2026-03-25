// coupon_redemptions: Tracks each use of a coupon by a customer.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { coupons } from "./coupons";
import { customers } from "./customers";
import { subscriptions } from "./subscriptions";

export const couponRedemptions = pgTable(
  "coupon_redemptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    couponId: uuid("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
    redeemedAt: timestamp("redeemed_at", { withTimezone: true }).notNull().defaultNow(),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_coupon_redemptions_coupon_id").on(table.couponId),
    index("idx_coupon_redemptions_customer_id").on(table.customerId),
    index("idx_coupon_redemptions_subscription_id").on(table.subscriptionId),
  ]
);
