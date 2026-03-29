// shopping_lists: User shopping lists, optionally linked to a meal plan.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ShoppingListDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} mealPlanId - FK → meal_plans
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ShoppingListDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ShoppingListDocument, "id">}
 */
export function createShoppingList(fields) {
  return {
    name:       fields.name,
    mealPlanId: fields.mealPlanId ?? null,
    createdBy:  fields.createdBy,
    createdAt:  Timestamp.now(),
    updatedAt:  Timestamp.now(),
  };
}

export const shoppingListConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      name:       data.name,
      mealPlanId: data.mealPlanId ?? null,
      createdBy:  data.createdBy,
      createdAt:  data.createdAt,
      updatedAt:  data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "shopping_lists"
 *   - createdBy ASC, createdAt DESC
 */
