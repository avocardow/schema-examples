// product_reviews: User-submitted ratings and written feedback for products, with moderation status tracking.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const REVIEW_STATUS = /** @type {const} */ ({
  PENDING:  "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

/**
 * @typedef {Object} ProductReviewDocument
 * @property {string} id
 * @property {string} productId - FK → products
 * @property {string} userId - FK → users
 * @property {number} rating
 * @property {string|null} title
 * @property {string|null} body
 * @property {string} status
 * @property {boolean} verifiedPurchase
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createProductReview(fields) {
  return {
    productId: fields.productId,
    userId: fields.userId,
    rating: fields.rating,
    title: fields.title ?? null,
    body: fields.body ?? null,
    status: fields.status ?? "pending",
    verifiedPurchase: fields.verifiedPurchase ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const productReviewConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      productId: data.productId,
      userId: data.userId,
      rating: data.rating,
      title: data.title ?? null,
      body: data.body ?? null,
      status: data.status,
      verifiedPurchase: data.verifiedPurchase,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - product_reviews: productId ASC, status ASC
  - product_reviews: productId ASC, userId ASC (composite unique)
  - product_reviews: status ASC
*/
