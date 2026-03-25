// usage_events: Append-only metered usage records per organization and feature.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} UsageEventDocument
 * @property {string}      id
 * @property {string}      organizationId  - FK → organizations
 * @property {string}      featureId       - FK → features
 * @property {number}      quantity
 * @property {string|null} userId          - FK → users
 * @property {Object|null} metadata
 * @property {string|null} idempotencyKey
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Omit<UsageEventDocument, "id" | "createdAt">} fields
 * @returns {Omit<UsageEventDocument, "id">}
 */
export function createUsageEvent(fields) {
  return {
    organizationId: fields.organizationId,
    featureId:      fields.featureId,
    quantity:       fields.quantity       ?? 1,
    userId:         fields.userId         ?? null,
    metadata:       fields.metadata       ?? null,
    idempotencyKey: fields.idempotencyKey ?? null,
    createdAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("usage_events").withConverter(usageEventConverter)
 */
export const usageEventConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      organizationId:  data.organizationId,
      featureId:       data.featureId,
      quantity:        data.quantity,
      userId:          data.userId          ?? null,
      metadata:        data.metadata        ?? null,
      idempotencyKey:  data.idempotencyKey  ?? null,
      createdAt:       data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - usage_events.organizationId ASC, usage_events.featureId ASC, usage_events.createdAt ASC
 *
 * Single-field:
 *   - usage_events.idempotencyKey ASC
 */
