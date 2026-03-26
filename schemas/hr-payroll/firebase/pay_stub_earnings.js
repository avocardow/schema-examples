// pay_stub_earnings: earning line items on a pay stub per earning type.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PayStubEarningDocument
 * @property {string} id
 * @property {string} payStubId - FK → pay_stubs
 * @property {string} earningTypeId - FK → earning_types
 * @property {number | null} hours - Decimal hours worked (e.g. 40.5)
 * @property {number | null} rate - Rate in cents (integer)
 * @property {number} amount - Amount in cents (integer)
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PayStubEarningDocument, "id" | "createdAt">} fields
 * @returns {Omit<PayStubEarningDocument, "id">}
 */
export function createPayStubEarning(fields) {
  return {
    payStubId: fields.payStubId,
    earningTypeId: fields.earningTypeId,
    hours: fields.hours ?? null,
    rate: fields.rate ?? null,
    amount: fields.amount,
    createdAt: Timestamp.now(),
  };
}

export const payStubEarningConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      payStubId: data.payStubId,
      earningTypeId: data.earningTypeId,
      hours: data.hours ?? null,
      rate: data.rate ?? null,
      amount: data.amount,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "pay_stub_earnings"
 *   - payStubId ASC
 *   - earningTypeId ASC
 */
