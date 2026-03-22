// return_items: Individual line items within a return authorization, tracking quantity and condition of returned products.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { returnAuthorizations } from "./return_authorizations";
import { orderItems } from "./order_items";

export const returnItemConditionEnum = pgEnum("return_item_condition", [
  "unopened",
  "like_new",
  "used",
  "damaged",
  "defective",
]);

export const returnItems = pgTable(
  "return_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    returnAuthorizationId: uuid("return_authorization_id")
      .notNull()
      .references(() => returnAuthorizations.id, { onDelete: "cascade" }),
    orderItemId: uuid("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    reason: text("reason"),
    condition: returnItemConditionEnum("condition"),
    receivedQuantity: integer("received_quantity").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("idx_return_items_return_authorization_id_order_item_id").on(
      table.returnAuthorizationId,
      table.orderItemId,
    ),
  ],
);
