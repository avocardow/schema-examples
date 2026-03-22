// goals: Conversion goals.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const GOAL_TYPE = /** @type {const} */ ({
  EVENT:     "event",
  PAGE_VIEW: "page_view",
  CUSTOM:    "custom",
});

/**
 * @typedef {Object} GoalDocument
 * @property {string}      id
 * @property {string}      name
 * @property {string|null} description
 * @property {string}      goalType
 * @property {string|null} eventTypeId  - FK → event_types
 * @property {string|null} urlPattern
 * @property {number|null} value
 * @property {boolean}     isActive
 * @property {string}      createdBy    - FK → users
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<GoalDocument, "name" | "goalType" | "createdBy"> & Partial<Pick<GoalDocument, "description" | "eventTypeId" | "urlPattern" | "value" | "isActive">>} fields
 * @returns {Omit<GoalDocument, "id">}
 */
export function createGoal(fields) {
  return {
    name:        fields.name,
    description: fields.description ?? null,
    goalType:    fields.goalType,
    eventTypeId: fields.eventTypeId ?? null,
    urlPattern:  fields.urlPattern  ?? null,
    value:       fields.value       ?? null,
    isActive:    fields.isActive    ?? true,
    createdBy:   fields.createdBy,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const goalConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      description: data.description ?? null,
      goalType:    data.goalType,
      eventTypeId: data.eventTypeId ?? null,
      urlPattern:  data.urlPattern  ?? null,
      value:       data.value       ?? null,
      isActive:    data.isActive,
      createdBy:   data.createdBy,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - goals.name      ASC
 *   - goals.goalType  ASC
 *   - goals.isActive  ASC
 *   - goals.createdBy ASC
 */
