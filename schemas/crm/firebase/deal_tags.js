// deal_tags: join table linking deals to tags.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} DealTagDocument
 * @property {string} id
 * @property {string} dealId - FK → deals
 * @property {string} tagId - FK → tags
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<DealTagDocument, "id" | "createdAt">} fields
 * @returns {Omit<DealTagDocument, "id">}
 */
export function createDealTag(fields) {
  return {
    dealId: fields.dealId,
    tagId: fields.tagId,
    createdAt: Timestamp.now(),
  };
}

export const dealTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      dealId: data.dealId,
      tagId: data.tagId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "deal_tags"
 *   - dealId ASC, tagId ASC (unique)
 *   - tagId ASC, createdAt DESC
 */
