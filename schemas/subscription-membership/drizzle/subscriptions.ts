// subscriptions: Active or historical subscription records for customers.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { coupons } from "./coupons";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "paused",
  "canceled",
  "expired",
  "incomplete",
]);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    status: subscriptionStatusEnum("status").notNull().default("incomplete"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    trialStart: timestamp("trial_start", { withTimezone: true }),
    trialEnd: timestamp("trial_end", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    pausedAt: timestamp("paused_at", { withTimezone: true }),
    resumesAt: timestamp("resumes_at", { withTimezone: true }),
    billingCycleAnchor: timestamp("billing_cycle_anchor", { withTimezone: true }),
    couponId: uuid("coupon_id").references(() => coupons.id, { onDelete: "set null" }),
    metadata: jsonb("metadata"),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_subscriptions_customer_id").on(table.customerId),
    index("idx_subscriptions_status").on(table.status),
    index("idx_subscriptions_provider").on(table.providerType, table.providerId),
  ]
);
