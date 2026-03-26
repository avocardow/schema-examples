// item_images: Images associated with auction items, with ordering support.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ItemImageDocument
 * @property {string} id
 * @property {string} itemId - FK → items
 * @property {string} url
 * @property {string|null} altText
 * @property {number} sortOrder
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ItemImageDocument, "id" | "createdAt">} data
 * @returns {Omit<ItemImageDocument, "id">}
 */
export function createItemImage(data) {
  return {
    itemId: data.itemId,
    url: data.url,
    altText: data.altText ?? null,
    sortOrder: data.sortOrder ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const itemImageConverter = {
  toFirestore(itemImage) {
    const { id, ...data } = itemImage;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      itemId: data.itemId,
      url: data.url,
      altText: data.altText ?? null,
      sortOrder: data.sortOrder,
      createdAt: data.createdAt,
    };
  },
};

// Suggested Firestore indexes:
// - item_images: itemId ASC
