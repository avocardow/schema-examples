// product_variants: SKU-level variants of a product with dimensions and option values.
// See README.md for full design rationale.
import { pgTable, uuid, text, boolean, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { products } from "./products";
import { shippingProfiles } from "./shipping_profiles";

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  shippingProfileId: uuid("shipping_profile_id").references(() => shippingProfiles.id, { onDelete: "set null" }),
  sku: text("sku").unique(),
  barcode: text("barcode"),
  title: text("title").notNull(),
  optionValues: jsonb("option_values"),
  weightGrams: integer("weight_grams"),
  heightMm: integer("height_mm"),
  widthMm: integer("width_mm"),
  lengthMm: integer("length_mm"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_product_variants_product_id").on(table.productId),
  index("idx_product_variants_barcode").on(table.barcode),
  index("idx_product_variants_shipping_profile_id").on(table.shippingProfileId),
]);
