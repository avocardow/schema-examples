// wishlist_items: Individual product variants saved to a customer's wishlist.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} WishlistItemDocument
 * @property {string} id
 * @property {string} wishlistId - FK → wishlists
 * @property {string} variantId - FK → product_variants
 * @property {Timestamp} addedAt
 */

export function createWishlistItem(fields) {
  return {
    wishlistId: fields.wishlistId,
    variantId: fields.variantId,
    addedAt: Timestamp.now(),
  };
}

export const wishlistItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      wishlistId: data.wishlistId,
      variantId: data.variantId,
      addedAt: data.addedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - wishlist_items: wishlistId ASC, variantId ASC (composite unique)
  - wishlist_items: variantId ASC
*/
