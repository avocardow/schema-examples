// invoices: billing documents generated for subscriptions or one-time charges.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const INVOICE_STATUS = /** @type {const} */ ({
  DRAFT: "draft",
  OPEN: "open",
  PAID: "paid",
  VOID: "void",
  UNCOLLECTIBLE: "uncollectible",
});

/**
 * @typedef {Object} InvoiceDocument
 * @property {string} id
 * @property {string} customerId - FK → customers
 * @property {string | null} subscriptionId - FK → subscriptions
 * @property {typeof INVOICE_STATUS[keyof typeof INVOICE_STATUS]} status
 * @property {string} currency
 * @property {number} subtotal
 * @property {number} tax
 * @property {number} total
 * @property {number} amountPaid
 * @property {number} amountDue
 * @property {import("firebase/firestore").Timestamp | null} periodStart
 * @property {import("firebase/firestore").Timestamp | null} periodEnd
 * @property {import("firebase/firestore").Timestamp | null} dueDate
 * @property {import("firebase/firestore").Timestamp | null} paidAt
 * @property {string | null} hostedInvoiceUrl
 * @property {string | null} invoicePdfUrl
 * @property {Object | null} metadata
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<InvoiceDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<InvoiceDocument, "id">}
 */
export function createInvoice(fields) {
  return {
    customerId: fields.customerId,
    subscriptionId: fields.subscriptionId ?? null,
    status: fields.status ?? INVOICE_STATUS.DRAFT,
    currency: fields.currency,
    subtotal: fields.subtotal ?? 0,
    tax: fields.tax ?? 0,
    total: fields.total ?? 0,
    amountPaid: fields.amountPaid ?? 0,
    amountDue: fields.amountDue ?? 0,
    periodStart: fields.periodStart ?? null,
    periodEnd: fields.periodEnd ?? null,
    dueDate: fields.dueDate ?? null,
    paidAt: fields.paidAt ?? null,
    hostedInvoiceUrl: fields.hostedInvoiceUrl ?? null,
    invoicePdfUrl: fields.invoicePdfUrl ?? null,
    metadata: fields.metadata ?? null,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const invoiceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId ?? null,
      status: data.status,
      currency: data.currency,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      amountPaid: data.amountPaid,
      amountDue: data.amountDue,
      periodStart: data.periodStart ?? null,
      periodEnd: data.periodEnd ?? null,
      dueDate: data.dueDate ?? null,
      paidAt: data.paidAt ?? null,
      hostedInvoiceUrl: data.hostedInvoiceUrl ?? null,
      invoicePdfUrl: data.invoicePdfUrl ?? null,
      metadata: data.metadata ?? null,
      providerType: data.providerType ?? null,
      providerId: data.providerId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "invoices"
 *   - customerId ASC, createdAt DESC
 *   - customerId ASC, status ASC
 *   - subscriptionId ASC, createdAt DESC
 *   - status ASC, dueDate ASC
 *   - providerType ASC, providerId ASC
 */
