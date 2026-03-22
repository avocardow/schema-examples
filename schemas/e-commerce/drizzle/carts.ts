// carts: Shopping carts supporting both authenticated users and anonymous sessions.
// See README.md for full design rationale.
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { addresses } from "./addresses";

export const carts = pgTable(
  "carts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    sessionId: text("session_id"),
    currency: text("currency").notNull().default("USD"),
    shippingAddressId: uuid("shipping_address_id").references(() => addresses.id, { onDelete: "set null" }),
    billingAddressId: uuid("billing_address_id").references(() => addresses.id, { onDelete: "set null" }),
    discountCode: text("discount_code"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_carts_user_id").on(table.userId),
    index("idx_carts_session_id").on(table.sessionId),
  ]
);
