// coupons: Discount codes applied to subscriptions or invoices.
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

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
]);

export const couponDurationEnum = pgEnum("coupon_duration", [
  "once",
  "repeating",
  "forever",
]);

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").unique(),
    name: text("name").notNull(),
    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: integer("discount_value").notNull(),
    currency: text("currency"),
    duration: couponDurationEnum("duration").notNull().default("once"),
    durationInMonths: integer("duration_in_months"),
    maxRedemptions: integer("max_redemptions"),
    timesRedeemed: integer("times_redeemed").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    metadata: jsonb("metadata"),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_coupons_is_active").on(table.isActive),
    index("idx_coupons_provider").on(table.providerType, table.providerId),
  ]
);
