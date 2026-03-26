// deduction_types: Catalog of payroll deduction types (tax, retirement, insurance, etc.).
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

export const deductionCategoryEnum = pgEnum("deduction_category", [
  "tax",
  "retirement",
  "insurance",
  "garnishment",
  "other",
]);

export const deductionTypes = pgTable(
  "deduction_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    category: deductionCategoryEnum("category").notNull(),
    isPretax: boolean("is_pretax").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_deduction_types_code").on(table.code),
    index("idx_deduction_types_category").on(table.category),
    index("idx_deduction_types_is_active").on(table.isActive),
  ]
);
