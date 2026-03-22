// wishlists: Named, optionally public product wish lists owned by a user.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} WishlistDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} name
 * @property {boolean} isPublic
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createWishlist(fields) {
  return {
    userId: fields.userId,
    name: fields.name ?? "Default",
    isPublic: fields.isPublic ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const wishlistConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      name: data.name,
      isPublic: data.isPublic,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - wishlists: userId ASC
*/
