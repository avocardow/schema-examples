// anonymous_ids: Maps anonymous IDs to users.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AnonymousIdDocument
 * @property {string}    id
 * @property {string}    anonymousId
 * @property {string}    userId       - FK → users
 * @property {Timestamp} firstSeenAt
 * @property {Timestamp} identifiedAt
 * @property {Timestamp} createdAt
 */

/**
 * @param {Pick<AnonymousIdDocument, "anonymousId" | "userId" | "firstSeenAt" | "identifiedAt">} fields
 * @returns {Omit<AnonymousIdDocument, "id">}
 */
export function createAnonymousId(fields) {
  return {
    anonymousId:  fields.anonymousId,
    userId:       fields.userId,
    firstSeenAt:  fields.firstSeenAt,
    identifiedAt: fields.identifiedAt,
    createdAt:    Timestamp.now(),
  };
}

export const anonymousIdConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      anonymousId:  data.anonymousId,
      userId:       data.userId,
      firstSeenAt:  data.firstSeenAt,
      identifiedAt: data.identifiedAt,
      createdAt:    data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - anonymous_ids.anonymousId ASC
 *   - anonymous_ids.userId      ASC
 */
