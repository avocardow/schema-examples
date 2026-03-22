// order_status_history: Tracks each status transition for an order, forming an audit trail.
// See README.md for full design rationale.
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { users } from "../../auth-rbac/drizzle/users";

export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  changedBy: uuid("changed_by").references(() => users.id, { onDelete: "set null" }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_order_status_history_order_id_created_at").on(table.orderId, table.createdAt),
]);
