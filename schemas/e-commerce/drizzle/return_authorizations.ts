// return_authorizations: Tracks RMA requests for order returns, approvals, and refund outcomes.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { users } from "../../auth-rbac/drizzle/users";

export const returnAuthorizationStatusEnum = pgEnum(
  "return_authorization_status",
  ["requested", "approved", "rejected", "received", "refunded", "canceled"]
);

export const returnAuthorizations = pgTable(
  "return_authorizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    rmaNumber: text("rma_number").unique().notNull(),
    status: returnAuthorizationStatusEnum("status")
      .notNull()
      .default("requested"),
    reason: text("reason"),
    note: text("note"),
    refundAmount: integer("refund_amount"),
    currency: text("currency").notNull(),
    requestedBy: uuid("requested_by").references(() => users.id, {
      onDelete: "set null",
    }),
    approvedBy: uuid("approved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    receivedAt: timestamp("received_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_return_authorizations_order_id").on(table.orderId),
    index("idx_return_authorizations_status").on(table.status),
    index("idx_return_authorizations_created_at").on(table.createdAt),
  ]
);
