// watchlists: Tracks which auctions a user is watching, with per-auction notification preferences.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "watchlists"
 * Document ID: Firestore auto-generated or UUID
 *
 * Composite uniqueness constraint: (userId, auctionId).
 * Firestore does not enforce uniqueness — enforce in application logic or security rules.
 */

/**
 * @typedef {Object} WatchlistDocument
 * @property {string}  id
 * @property {string}  userId       - FK → users (cascade delete)
 * @property {string}  auctionId    - FK → auctions (cascade delete)
 * @property {boolean} notifyOutbid
 * @property {boolean} notifyEnding
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<WatchlistDocument, "id" | "createdAt">} data
 * @returns {Omit<WatchlistDocument, "id">}
 */
export function createWatchlist(data) {
  return {
    userId:       data.userId,
    auctionId:    data.auctionId,
    notifyOutbid: data.notifyOutbid ?? true,
    notifyEnding: data.notifyEnding ?? true,
    createdAt:    Timestamp.now(),
  };
}

export const watchlistConverter = {
  toFirestore(watchlist) {
    const { id, ...data } = watchlist;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      userId:       data.userId,
      auctionId:    data.auctionId,
      notifyOutbid: data.notifyOutbid,
      notifyEnding: data.notifyEnding,
      createdAt:    data.createdAt,
    };
  },
};

// Suggested Firestore indexes:
// - watchlists: auctionId ASC
// - watchlists: (userId, auctionId) — Enforce uniqueness in application logic.
