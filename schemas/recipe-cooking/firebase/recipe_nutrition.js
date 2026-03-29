// recipe_nutrition: Nutritional breakdown per recipe (one-to-one with recipes).
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} RecipeNutritionDocument
 * @property {string} id
 * @property {string} recipeId - FK → recipes
 * @property {number|null} calories
 * @property {number|null} totalFatGrams
 * @property {number|null} saturatedFatGrams
 * @property {number|null} carbohydratesGrams
 * @property {number|null} fiberGrams
 * @property {number|null} sugarGrams
 * @property {number|null} proteinGrams
 * @property {number|null} sodiumMg
 * @property {number|null} cholesterolMg
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<RecipeNutritionDocument, "id" | "updatedAt">} fields
 * @returns {Omit<RecipeNutritionDocument, "id">}
 */
export function createRecipeNutrition(fields) {
  return {
    recipeId:          fields.recipeId,
    calories:          fields.calories ?? null,
    totalFatGrams:     fields.totalFatGrams ?? null,
    saturatedFatGrams: fields.saturatedFatGrams ?? null,
    carbohydratesGrams: fields.carbohydratesGrams ?? null,
    fiberGrams:        fields.fiberGrams ?? null,
    sugarGrams:        fields.sugarGrams ?? null,
    proteinGrams:      fields.proteinGrams ?? null,
    sodiumMg:          fields.sodiumMg ?? null,
    cholesterolMg:     fields.cholesterolMg ?? null,
    updatedAt:         Timestamp.now(),
  };
}

export const recipeNutritionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      recipeId:           data.recipeId,
      calories:           data.calories ?? null,
      totalFatGrams:      data.totalFatGrams ?? null,
      saturatedFatGrams:  data.saturatedFatGrams ?? null,
      carbohydratesGrams: data.carbohydratesGrams ?? null,
      fiberGrams:         data.fiberGrams ?? null,
      sugarGrams:         data.sugarGrams ?? null,
      proteinGrams:       data.proteinGrams ?? null,
      sodiumMg:           data.sodiumMg ?? null,
      cholesterolMg:      data.cholesterolMg ?? null,
      updatedAt:          data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "recipe_nutrition"
 *   - recipeId ASC
 */
