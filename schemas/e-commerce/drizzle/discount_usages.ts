// discount_usages: Tracks each time a discount code is applied to an order.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { discounts } from "./discounts";
import { orders } from "./orders";
import { users } from "../../auth-rbac/drizzle/users";

export const discountUsages = pgTable("discount_usages", {
  id: uuid("id").primaryKey().defaultRandom(),
  discountId: uuid("discount_id").notNull().references(() => discounts.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_discount_usages_discount_id_user_id").on(table.discountId, table.userId),
  unique("idx_discount_usages_discount_id_order_id").on(table.discountId, table.orderId),
]);
