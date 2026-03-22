// product_reviews: User-submitted ratings and text reviews for products, with moderation status.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  text,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "../../auth-rbac/drizzle/users";

export const reviewStatusEnum = pgEnum("product_review_status", [
  "pending",
  "approved",
  "rejected",
]);

export const productReviews = pgTable(
  "product_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: text("title"),
    body: text("body"),
    status: reviewStatusEnum("status").notNull().default("pending"),
    verifiedPurchase: boolean("verified_purchase").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_product_reviews_product_id_status").on(table.productId, table.status),
    unique("idx_product_reviews_product_id_user_id").on(table.productId, table.userId),
    index("idx_product_reviews_status").on(table.status),
  ]
);
