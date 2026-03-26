// feedback: Buyer/seller ratings and comments left after an auction concludes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const FEEDBACK_DIRECTION = /** @type {const} */ ({
  BUYER_TO_SELLER: "buyer_to_seller",
  SELLER_TO_BUYER: "seller_to_buyer",
});

/**
 * @typedef {Object} FeedbackDocument
 * @property {string} id
 * @property {string} auctionWinnerId - FK → auction_winners
 * @property {string} authorId - FK → users
 * @property {string} recipientId - FK → users
 * @property {typeof FEEDBACK_DIRECTION[keyof typeof FEEDBACK_DIRECTION]} direction
 * @property {number} rating
 * @property {string|null} comment
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<FeedbackDocument, "id" | "createdAt">} data
 * @returns {Omit<FeedbackDocument, "id">}
 */
export function createFeedback(data) {
  return {
    auctionWinnerId: data.auctionWinnerId,
    authorId: data.authorId,
    recipientId: data.recipientId,
    direction: data.direction,
    rating: data.rating,
    comment: data.comment ?? null,
    createdAt: Timestamp.now(),
  };
}

export const feedbackConverter = {
  toFirestore(feedback) {
    const { id, ...data } = feedback;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      auctionWinnerId: data.auctionWinnerId,
      authorId: data.authorId,
      recipientId: data.recipientId,
      direction: data.direction,
      rating: data.rating,
      comment: data.comment ?? null,
      createdAt: data.createdAt,
    };
  },
};

// Suggested Firestore indexes:
// - feedback: auctionWinnerId ASC, direction ASC (unique)
// - feedback: recipientId ASC
// - feedback: authorId ASC
