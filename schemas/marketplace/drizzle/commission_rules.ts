// commission_rules: Configurable commission structures by scope (global, vendor, or category).
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";
import { categories } from "../../e-commerce/drizzle/categories";

export const commissionScope = pgEnum("commission_scope", [
  "global",
  "vendor",
  "category",
]);

export const commissionRateType = pgEnum("commission_rate_type", [
  "percentage",
  "flat",
  "hybrid",
]);

export const commissionRules = pgTable(
  "commission_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    scope: commissionScope("scope").notNull(),
    vendorId: uuid("vendor_id").references(() => vendors.id, {
      onDelete: "cascade",
    }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "cascade",
    }),
    rateType: commissionRateType("rate_type").notNull().default("percentage"),
    percentageRate: numeric("percentage_rate"),
    flatRate: integer("flat_rate"),
    currency: text("currency"),
    minCommission: integer("min_commission"),
    maxCommission: integer("max_commission"),
    isActive: boolean("is_active").notNull().default(true),
    priority: integer("priority").notNull().default(0),
    effectiveFrom: timestamp("effective_from", { withTimezone: true }),
    effectiveTo: timestamp("effective_to", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_commission_rules_scope_is_active").on(
      table.scope,
      table.isActive
    ),
    index("idx_commission_rules_vendor_id").on(table.vendorId),
    index("idx_commission_rules_category_id").on(table.categoryId),
  ]
);
