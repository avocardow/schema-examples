// bid_increment_rules: Price-range-based minimum bid increments for auctions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} BidIncrementRuleDocument
 * @property {string}         id
 * @property {string|null}    auctionId   - FK → auctions
 * @property {number}         minPrice
 * @property {number|null}    maxPrice
 * @property {number}         increment
 * @property {Timestamp}      createdAt
 */

/**
 * @param {Pick<BidIncrementRuleDocument, "minPrice" | "increment"> & Partial<Pick<BidIncrementRuleDocument, "auctionId" | "maxPrice">>} fields
 * @returns {Omit<BidIncrementRuleDocument, "id">}
 */
export function createBidIncrementRule(fields) {
  return {
    auctionId: fields.auctionId ?? null,
    minPrice:  fields.minPrice,
    maxPrice:  fields.maxPrice ?? null,
    increment: fields.increment,
    createdAt: Timestamp.now(),
  };
}

export const bidIncrementRuleConverter = {
  toFirestore(doc) {
    const { id, ...data } = doc;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      auctionId: data.auctionId ?? null,
      minPrice:  data.minPrice,
      maxPrice:  data.maxPrice ?? null,
      increment: data.increment,
      createdAt: data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - bid_increment_rules.auctionId ASC
 *   - bid_increment_rules.minPrice  ASC
 */
