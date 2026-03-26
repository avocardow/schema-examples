// listings: Vendor-specific product listings with approval workflow and condition grading.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";
import { products } from "../../e-commerce/drizzle/products";

export const listingStatus = pgEnum("listing_status", [
  "draft",
  "pending_approval",
  "active",
  "paused",
  "rejected",
  "archived",
]);

export const listingCondition = pgEnum("listing_condition", [
  "new",
  "refurbished",
  "used_like_new",
  "used_good",
  "used_fair",
]);

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    status: listingStatus("status").notNull().default("draft"),
    condition: listingCondition("condition").notNull().default("new"),
    handlingDays: integer("handling_days").notNull().default(1),
    rejectionReason: text("rejection_reason"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("idx_listings_vendor_id_product_id").on(
      table.vendorId,
      table.productId
    ),
    index("idx_listings_product_id_status").on(table.productId, table.status),
    index("idx_listings_status").on(table.status),
  ]
);
