// products: Core product catalog entry with status lifecycle and soft delete.
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
import { sql } from "drizzle-orm";
import { categories } from "./categories";
import { brands } from "./brands";

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    brandId: uuid("brand_id").references(() => brands.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    status: productStatusEnum("status").notNull().default("draft"),
    productType: text("product_type"),
    options: jsonb("options"),
    metadata: jsonb("metadata").default(sql`'{}'`),
    isFeatured: boolean("is_featured").notNull().default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_products_category_id").on(table.categoryId),
    index("idx_products_brand_id").on(table.brandId),
    index("idx_products_status").on(table.status),
    index("idx_products_is_featured").on(table.isFeatured),
    index("idx_products_deleted_at").on(table.deletedAt),
    index("idx_products_status_deleted_at").on(table.status, table.deletedAt),
  ]
);
