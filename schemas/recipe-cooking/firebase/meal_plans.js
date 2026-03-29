// meal_plans: User-created meal plans spanning a date range.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MealPlanDocument
 * @property {string} id
 * @property {string} name
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<MealPlanDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<MealPlanDocument, "id">}
 */
export function createMealPlan(fields) {
  return {
    name:      fields.name,
    startDate: fields.startDate,
    endDate:   fields.endDate,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const mealPlanConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      name:      data.name,
      startDate: data.startDate,
      endDate:   data.endDate,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "meal_plans"
 *   - createdBy ASC, startDate DESC
 */
