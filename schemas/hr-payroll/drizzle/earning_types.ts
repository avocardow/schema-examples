// earning_types: Categorized earning definitions (regular, overtime, bonus, etc.) for payroll processing.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";

export const earningCategoryEnum = pgEnum("earning_category", [
  "regular",
  "overtime",
  "bonus",
  "commission",
  "reimbursement",
  "other",
]);

export const earningTypes = pgTable(
  "earning_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    category: earningCategoryEnum("category").notNull(),
    isTaxable: boolean("is_taxable").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_earning_types_code").on(table.code),
    index("idx_earning_types_category").on(table.category),
    index("idx_earning_types_is_active").on(table.isActive),
  ]
);
