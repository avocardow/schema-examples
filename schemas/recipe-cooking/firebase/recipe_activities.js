// recipe_activities: Audit log of actions performed on recipes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const RECIPE_ACTION = /** @type {const} */ ({
  CREATED:               "created",
  UPDATED:               "updated",
  PUBLISHED:             "published",
  ARCHIVED:              "archived",
  RATED:                 "rated",
  FAVORITED:             "favorited",
  ADDED_TO_COLLECTION:   "added_to_collection",
  ADDED_TO_MEAL_PLAN:    "added_to_meal_plan",
});

/**
 * @typedef {Object} RecipeActivityDocument
 * @property {string} id
 * @property {string|null} recipeId - FK → recipes
 * @property {string} actorId - FK → users
 * @property {string} action
 * @property {Object|null} details
 * @property {import("firebase/firestore").Timestamp} occurredAt
 */

/**
 * @param {Omit<RecipeActivityDocument, "id">} fields
 * @returns {Omit<RecipeActivityDocument, "id">}
 */
export function createRecipeActivity(fields) {
  return {
    recipeId:   fields.recipeId ?? null,
    actorId:    fields.actorId,
    action:     fields.action,
    details:    fields.details ?? null,
    occurredAt: Timestamp.now(),
  };
}

export const recipeActivityConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      recipeId:   data.recipeId ?? null,
      actorId:    data.actorId,
      action:     data.action,
      details:    data.details ?? null,
      occurredAt: data.occurredAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "recipe_activities"
 *   - recipeId ASC, occurredAt DESC
 *   - actorId ASC, occurredAt DESC
 *   - action ASC, occurredAt DESC
 */
