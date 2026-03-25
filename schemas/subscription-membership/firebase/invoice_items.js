// invoice_items: individual line items on an invoice with amount and proration details.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} InvoiceItemDocument
 * @property {string} id
 * @property {string} invoiceId - FK → invoices
 * @property {string | null} planPriceId - FK → plan_prices
 * @property {string} description
 * @property {number} amount
 * @property {string} currency
 * @property {number} quantity
 * @property {boolean} isProration
 * @property {import("firebase/firestore").Timestamp | null} periodStart
 * @property {import("firebase/firestore").Timestamp | null} periodEnd
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<InvoiceItemDocument, "id" | "createdAt">} fields
 * @returns {Omit<InvoiceItemDocument, "id">}
 */
export function createInvoiceItem(fields) {
  return {
    invoiceId: fields.invoiceId,
    planPriceId: fields.planPriceId ?? null,
    description: fields.description,
    amount: fields.amount,
    currency: fields.currency,
    quantity: fields.quantity ?? 1,
    isProration: fields.isProration ?? false,
    periodStart: fields.periodStart ?? null,
    periodEnd: fields.periodEnd ?? null,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
  };
}

export const invoiceItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      invoiceId: data.invoiceId,
      planPriceId: data.planPriceId ?? null,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      quantity: data.quantity,
      isProration: data.isProration,
      periodStart: data.periodStart ?? null,
      periodEnd: data.periodEnd ?? null,
      providerType: data.providerType ?? null,
      providerId: data.providerId ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "invoice_items"
 *   - invoiceId ASC, createdAt ASC
 *   - planPriceId ASC
 *   - providerType ASC, providerId ASC
 */
