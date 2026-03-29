// foods: Master list of ingredients/food items used across recipes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FoodDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} category
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<FoodDocument, "id" | "createdAt">} fields
 * @returns {Omit<FoodDocument, "id">}
 */
export function createFood(fields) {
  return {
    name:      fields.name,
    category:  fields.category ?? null,
    createdAt: Timestamp.now(),
  };
}

export const foodConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      name:      data.name,
      category:  data.category ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "foods"
 *   - name ASC
 *   - category ASC, name ASC
 */
