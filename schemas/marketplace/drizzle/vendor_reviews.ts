// vendor_reviews: Customer ratings and feedback for vendors, with moderation workflow.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  text,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";
import { users } from "../../auth-rbac/drizzle/users";
import { vendorOrders } from "./vendor_orders";

export const vendorReviewStatus = pgEnum("vendor_review_status", [
  "pending",
  "approved",
  "rejected",
]);

export const vendorReviews = pgTable(
  "vendor_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    vendorOrderId: uuid("vendor_order_id").references(() => vendorOrders.id, {
      onDelete: "set null",
    }),
    rating: integer("rating").notNull(),
    title: text("title"),
    body: text("body"),
    status: vendorReviewStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_vendor_reviews_vendor_id_status").on(
      table.vendorId,
      table.status
    ),
    unique("idx_vendor_reviews_vendor_id_customer_id_vendor_order_id").on(
      table.vendorId,
      table.customerId,
      table.vendorOrderId
    ),
    index("idx_vendor_reviews_status").on(table.status),
  ]
);
