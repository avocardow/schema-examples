// auctions: Auction listings with type, pricing, timing, and anti-sniping controls.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const AUCTION_TYPE = /** @type {const} */ ({
  ENGLISH: "english",
  DUTCH: "dutch",
  SEALED_BID: "sealed_bid",
  BUY_NOW_ONLY: "buy_now_only",
});

export const AUCTION_STATUS = /** @type {const} */ ({
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  ACTIVE: "active",
  CLOSING: "closing",
  CLOSED: "closed",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} AuctionDocument
 * @property {string} id
 * @property {string} itemId - FK → items
 * @property {string} sellerId - FK → users
 * @property {string} auctionType
 * @property {string} status
 * @property {string} title
 * @property {string|null} description
 * @property {number} startingPrice
 * @property {number|null} reservePrice
 * @property {number|null} buyNowPrice
 * @property {number} currentPrice
 * @property {number} bidCount
 * @property {string|null} highestBidderId - FK → users
 * @property {number|null} buyerPremiumPct
 * @property {Timestamp|null} startTime
 * @property {Timestamp|null} endTime
 * @property {Timestamp|null} effectiveEndTime
 * @property {number} extensionSeconds
 * @property {number} extensionWindowSeconds
 * @property {string} currency
 * @property {Timestamp|null} closedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<AuctionDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<AuctionDocument, "id">}
 */
export function createAuction(data) {
  return {
    itemId: data.itemId,
    sellerId: data.sellerId,
    auctionType: data.auctionType ?? AUCTION_TYPE.ENGLISH,
    status: data.status ?? AUCTION_STATUS.DRAFT,
    title: data.title,
    description: data.description ?? null,
    startingPrice: data.startingPrice,
    reservePrice: data.reservePrice ?? null,
    buyNowPrice: data.buyNowPrice ?? null,
    currentPrice: data.currentPrice ?? 0,
    bidCount: data.bidCount ?? 0,
    highestBidderId: data.highestBidderId ?? null,
    buyerPremiumPct: data.buyerPremiumPct ?? null,
    startTime: data.startTime ?? null,
    endTime: data.endTime ?? null,
    effectiveEndTime: data.effectiveEndTime ?? null,
    extensionSeconds: data.extensionSeconds ?? 300,
    extensionWindowSeconds: data.extensionWindowSeconds ?? 300,
    currency: data.currency ?? "USD",
    closedAt: data.closedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const auctionConverter = {
  toFirestore(auction) {
    const { id, ...data } = auction;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      itemId: data.itemId,
      sellerId: data.sellerId,
      auctionType: data.auctionType,
      status: data.status,
      title: data.title,
      description: data.description ?? null,
      startingPrice: data.startingPrice,
      reservePrice: data.reservePrice ?? null,
      buyNowPrice: data.buyNowPrice ?? null,
      currentPrice: data.currentPrice,
      bidCount: data.bidCount,
      highestBidderId: data.highestBidderId ?? null,
      buyerPremiumPct: data.buyerPremiumPct ?? null,
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      effectiveEndTime: data.effectiveEndTime ?? null,
      extensionSeconds: data.extensionSeconds,
      extensionWindowSeconds: data.extensionWindowSeconds,
      currency: data.currency,
      closedAt: data.closedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - sellerId ASC
// - status ASC
// - auctionType ASC
// - endTime ASC
