// funding_links: External funding and donation links for shows.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FundingLinkDocument
 * @property {string} id
 * @property {string} showId - FK → shows
 * @property {string} url
 * @property {string} title
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<FundingLinkDocument, "id" | "createdAt">} fields
 * @returns {Omit<FundingLinkDocument, "id">}
 */
export function createFundingLink(fields) {
  return {
    showId: fields.showId,
    url: fields.url,
    title: fields.title,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const fundingLinkConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      showId: data.showId,
      url: data.url,
      title: data.title,
      position: data.position,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - showId ASC, position ASC
 */
