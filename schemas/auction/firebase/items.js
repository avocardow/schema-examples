// items: Auction items listed by sellers with condition grading and category assignment.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ITEM_CONDITION = /** @type {const} */ ({
  NEW: "new",
  LIKE_NEW: "like_new",
  EXCELLENT: "excellent",
  GOOD: "good",
  FAIR: "fair",
  POOR: "poor",
});

/**
 * @typedef {Object} ItemDocument
 * @property {string} id
 * @property {string} sellerId - FK → users
 * @property {string|null} categoryId - FK → categories
 * @property {string} title
 * @property {string|null} description
 * @property {typeof ITEM_CONDITION[keyof typeof ITEM_CONDITION]} condition
 * @property {string|null} conditionNotes
 * @property {Object|null} metadata
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<ItemDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<ItemDocument, "id">}
 */
export function createItem(data) {
  return {
    sellerId: data.sellerId,
    categoryId: data.categoryId ?? null,
    title: data.title,
    description: data.description ?? null,
    condition: data.condition ?? ITEM_CONDITION.NEW,
    conditionNotes: data.conditionNotes ?? null,
    metadata: data.metadata ?? {},
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const itemConverter = {
  toFirestore(item) {
    const { id, ...data } = item;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      sellerId: data.sellerId,
      categoryId: data.categoryId ?? null,
      title: data.title,
      description: data.description ?? null,
      condition: data.condition,
      conditionNotes: data.conditionNotes ?? null,
      metadata: data.metadata ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - sellerId ASC
// - categoryId ASC
// - condition ASC
