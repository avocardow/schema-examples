// discounts: Discount codes and rules with usage tracking and validity windows.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
  "free_shipping",
]);

export const discounts = pgTable(
  "discounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code"),
    type: discountTypeEnum("type").notNull(),
    value: numeric("value").notNull(),
    currency: text("currency"),
    conditions: jsonb("conditions"),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),
    perCustomerLimit: integer("per_customer_limit"),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_discounts_code").on(table.code),
    index("idx_discounts_type").on(table.type),
    index("idx_discounts_active_validity").on(
      table.isActive,
      table.startsAt,
      table.endsAt,
    ),
  ],
);
