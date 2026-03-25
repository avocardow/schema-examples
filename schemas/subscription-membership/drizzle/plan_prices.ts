// plan_prices: Pricing tiers for plans — recurring, one-time, or usage-based.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { plans } from "./plans";

export const priceTypeEnum = pgEnum("price_type", [
  "recurring",
  "one_time",
  "usage_based",
]);

export const priceIntervalEnum = pgEnum("price_interval", [
  "day",
  "week",
  "month",
  "year",
]);

export const planPrices = pgTable(
  "plan_prices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    nickname: text("nickname"),
    type: priceTypeEnum("type").notNull().default("recurring"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    interval: priceIntervalEnum("interval"),
    intervalCount: integer("interval_count").notNull().default(1),
    trialPeriodDays: integer("trial_period_days"),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata"),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_plan_prices_plan_id").on(table.planId),
    index("idx_plan_prices_is_active").on(table.isActive),
    index("idx_plan_prices_provider").on(table.providerType, table.providerId),
  ]
);
