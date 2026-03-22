// funnel_steps: Steps within funnels.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FunnelStepDocument
 * @property {string}      id
 * @property {string}      funnelId     - FK → funnels
 * @property {string}      eventTypeId  - FK → event_types
 * @property {number}      stepOrder
 * @property {string|null} name
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<FunnelStepDocument, "funnelId" | "eventTypeId" | "stepOrder"> & Partial<Pick<FunnelStepDocument, "name">>} fields
 * @returns {Omit<FunnelStepDocument, "id">}
 */
export function createFunnelStep(fields) {
  return {
    funnelId:    fields.funnelId,
    eventTypeId: fields.eventTypeId,
    stepOrder:   fields.stepOrder,
    name:        fields.name ?? null,
    createdAt:   Timestamp.now(),
  };
}

export const funnelStepConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      funnelId:    data.funnelId,
      eventTypeId: data.eventTypeId,
      stepOrder:   data.stepOrder,
      name:        data.name ?? null,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - funnel_steps.funnelId ASC
 *
 * Composite:
 *   - funnel_steps.funnelId ASC, funnel_steps.stepOrder ASC
 */
