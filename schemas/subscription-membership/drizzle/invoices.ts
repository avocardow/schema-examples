// invoices: Billing documents generated for customers, optionally tied to subscriptions.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { subscriptions } from "./subscriptions";

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "open",
  "paid",
  "void",
  "uncollectible",
]);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
    status: invoiceStatusEnum("status").notNull().default("draft"),
    currency: text("currency").notNull(),
    subtotal: integer("subtotal").notNull().default(0),
    tax: integer("tax").notNull().default(0),
    total: integer("total").notNull().default(0),
    amountPaid: integer("amount_paid").notNull().default(0),
    amountDue: integer("amount_due").notNull().default(0),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    dueDate: timestamp("due_date", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    hostedInvoiceUrl: text("hosted_invoice_url"),
    invoicePdfUrl: text("invoice_pdf_url"),
    metadata: jsonb("metadata"),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_invoices_customer_id").on(table.customerId),
    index("idx_invoices_subscription_id").on(table.subscriptionId),
    index("idx_invoices_status").on(table.status),
    index("idx_invoices_provider").on(table.providerType, table.providerId),
  ]
);
