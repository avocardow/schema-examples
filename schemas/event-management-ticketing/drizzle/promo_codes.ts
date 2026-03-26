// promo_codes: Discount codes applicable to event ticket purchases.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { events } from "./events";

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed",
]);

export const promoCodes = pgTable(
  "promo_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: integer("discount_value").notNull(),
    currency: text("currency"),
    maxUses: integer("max_uses"),
    timesUsed: integer("times_used").notNull().default(0),
    maxUsesPerOrder: integer("max_uses_per_order").notNull().default(1),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_promo_codes_event_id_code").on(table.eventId, table.code),
    index("idx_promo_codes_is_active").on(table.isActive),
  ],
);
