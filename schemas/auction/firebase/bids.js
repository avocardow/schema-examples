// bids: Individual bid records placed on auctions, supporting proxy bidding.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {"active"|"outbid"|"winning"|"won"|"cancelled"} BidStatus
 */

export const BID_STATUS = /** @type {const} */ ({
  ACTIVE:    "active",
  OUTBID:    "outbid",
  WINNING:   "winning",
  WON:       "won",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} BidDocument
 * @property {string}         id         - Document ID (from snapshot.id).
 * @property {string}         auctionId  - FK → auctions
 * @property {string}         bidderId   - FK → users
 * @property {number}         amount
 * @property {number|null}    maxAmount
 * @property {BidStatus}      status
 * @property {boolean}        isProxy
 * @property {string|null}    ipAddress
 * @property {Timestamp}      createdAt
 */

/**
 * @param {Pick<BidDocument, "auctionId" | "bidderId" | "amount"> & Partial<Pick<BidDocument, "maxAmount" | "status" | "isProxy" | "ipAddress">>} fields
 * @returns {Omit<BidDocument, "id">}
 */
export function createBid(fields) {
  return {
    auctionId: fields.auctionId,
    bidderId:  fields.bidderId,
    amount:    fields.amount,
    maxAmount: fields.maxAmount ?? null,
    status:    fields.status    ?? BID_STATUS.ACTIVE,
    isProxy:   fields.isProxy   ?? false,
    ipAddress: fields.ipAddress ?? null,
    createdAt: Timestamp.now(),
  };
}

export const bidConverter = {
  toFirestore(bid) {
    const { id, ...data } = bid;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      auctionId: data.auctionId,
      bidderId:  data.bidderId,
      amount:    data.amount,
      maxAmount: data.maxAmount ?? null,
      status:    data.status,
      isProxy:   data.isProxy,
      ipAddress: data.ipAddress ?? null,
      createdAt: data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - bids.auctionId  ASC
 *   - bids.bidderId   ASC
 *   - bids.status     ASC
 *
 * Composite:
 *   - bids.auctionId ASC, bids.amount ASC  (unique)
 */
