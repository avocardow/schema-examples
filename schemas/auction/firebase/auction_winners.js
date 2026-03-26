// auction_winners: Records winning bids with settlement tracking and buyer-premium calculations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {"pending"|"paid"|"shipped"|"completed"|"disputed"|"refunded"} SettlementStatus
 */

export const SETTLEMENT_STATUS = /** @type {const} */ ({
  PENDING:   "pending",
  PAID:      "paid",
  SHIPPED:   "shipped",
  COMPLETED: "completed",
  DISPUTED:  "disputed",
  REFUNDED:  "refunded",
});

/**
 * @typedef {Object} AuctionWinnerDocument
 * @property {string}              id               - Document ID (from snapshot.id).
 * @property {string}              auctionId        - FK → auctions (unique)
 * @property {string}              winningBidId     - FK → bids (unique)
 * @property {string}              winnerId         - FK → users
 * @property {string}              sellerId         - FK → users
 * @property {number}              hammerPrice
 * @property {number}              buyerPremium
 * @property {number}              totalPrice
 * @property {SettlementStatus}    settlementStatus
 * @property {Timestamp|null}      paidAt
 * @property {Timestamp|null}      shippedAt
 * @property {Timestamp|null}      completedAt
 * @property {string|null}         notes
 * @property {Timestamp}           createdAt
 * @property {Timestamp}           updatedAt
 */

/**
 * @param {Pick<AuctionWinnerDocument, "auctionId" | "winningBidId" | "winnerId" | "sellerId" | "hammerPrice" | "totalPrice"> & Partial<Pick<AuctionWinnerDocument, "buyerPremium" | "settlementStatus" | "paidAt" | "shippedAt" | "completedAt" | "notes">>} fields
 * @returns {Omit<AuctionWinnerDocument, "id">}
 */
export function createAuctionWinner(fields) {
  return {
    auctionId:        fields.auctionId,
    winningBidId:     fields.winningBidId,
    winnerId:         fields.winnerId,
    sellerId:         fields.sellerId,
    hammerPrice:      fields.hammerPrice,
    buyerPremium:     fields.buyerPremium ?? 0,
    totalPrice:       fields.totalPrice,
    settlementStatus: fields.settlementStatus ?? SETTLEMENT_STATUS.PENDING,
    paidAt:           fields.paidAt ?? null,
    shippedAt:        fields.shippedAt ?? null,
    completedAt:      fields.completedAt ?? null,
    notes:            fields.notes ?? null,
    createdAt:        Timestamp.now(),
    updatedAt:        Timestamp.now(),
  };
}

export const auctionWinnerConverter = {
  toFirestore(auctionWinner) {
    const { id, ...data } = auctionWinner;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      auctionId:        data.auctionId,
      winningBidId:     data.winningBidId,
      winnerId:         data.winnerId,
      sellerId:         data.sellerId,
      hammerPrice:      data.hammerPrice,
      buyerPremium:     data.buyerPremium,
      totalPrice:       data.totalPrice,
      settlementStatus: data.settlementStatus,
      paidAt:           data.paidAt ?? null,
      shippedAt:        data.shippedAt ?? null,
      completedAt:      data.completedAt ?? null,
      notes:            data.notes ?? null,
      createdAt:        data.createdAt,
      updatedAt:        data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - auction_winners.winnerId          ASC
 *   - auction_winners.sellerId          ASC
 *   - auction_winners.settlementStatus  ASC
 *
 * Unique (enforced at application level):
 *   - auction_winners.auctionId    ASC
 *   - auction_winners.winningBidId ASC
 */
