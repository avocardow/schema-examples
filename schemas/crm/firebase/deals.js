// deals: sales opportunities tracked through pipeline stages with value and priority.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DEAL_PRIORITIES = /** @type {const} */ ({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

/**
 * @typedef {Object} DealDocument
 * @property {string} id
 * @property {string} name
 * @property {string} pipelineId - FK → pipelines
 * @property {string | null} stageId - FK → pipeline_stages
 * @property {number | null} value
 * @property {string} currency
 * @property {string | null} expectedCloseDate
 * @property {import("firebase/firestore").Timestamp | null} closedAt
 * @property {string | null} lostReason
 * @property {typeof DEAL_PRIORITIES[keyof typeof DEAL_PRIORITIES]} priority
 * @property {string | null} ownerId - FK → users
 * @property {string | null} companyId - FK → companies
 * @property {string | null} contactId - FK → contacts
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<DealDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<DealDocument, "id">}
 */
export function createDeal(fields) {
  return {
    name: fields.name,
    pipelineId: fields.pipelineId,
    stageId: fields.stageId ?? null,
    value: fields.value ?? null,
    currency: fields.currency ?? "USD",
    expectedCloseDate: fields.expectedCloseDate ?? null,
    closedAt: fields.closedAt ?? null,
    lostReason: fields.lostReason ?? null,
    priority: fields.priority ?? DEAL_PRIORITIES.MEDIUM,
    ownerId: fields.ownerId ?? null,
    companyId: fields.companyId ?? null,
    contactId: fields.contactId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const dealConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      pipelineId: data.pipelineId,
      stageId: data.stageId ?? null,
      value: data.value ?? null,
      currency: data.currency,
      expectedCloseDate: data.expectedCloseDate ?? null,
      closedAt: data.closedAt ?? null,
      lostReason: data.lostReason ?? null,
      priority: data.priority,
      ownerId: data.ownerId ?? null,
      companyId: data.companyId ?? null,
      contactId: data.contactId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "deals"
 *   - pipelineId ASC, stageId ASC, createdAt DESC
 *   - ownerId ASC, createdAt DESC
 *   - companyId ASC, createdAt DESC
 *   - contactId ASC, createdAt DESC
 *   - priority ASC, createdAt DESC
 *   - expectedCloseDate ASC, createdAt DESC
 *   - closedAt ASC, createdAt DESC
 */
