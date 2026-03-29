// meal_plan_entries: Individual recipe slots within a meal plan.
// See README.md for full design rationale.

export const MEAL_TYPE = /** @type {const} */ ({
  BREAKFAST: "breakfast",
  LUNCH:     "lunch",
  DINNER:    "dinner",
  SNACK:     "snack",
});

/**
 * @typedef {Object} MealPlanEntryDocument
 * @property {string} id
 * @property {string} mealPlanId - FK → meal_plans
 * @property {string} recipeId - FK → recipes
 * @property {string} planDate
 * @property {string} mealType
 * @property {number|null} servings
 * @property {string|null} note
 */

/**
 * @param {Omit<MealPlanEntryDocument, "id">} fields
 * @returns {Omit<MealPlanEntryDocument, "id">}
 */
export function createMealPlanEntry(fields) {
  return {
    mealPlanId: fields.mealPlanId,
    recipeId:   fields.recipeId,
    planDate:   fields.planDate,
    mealType:   fields.mealType,
    servings:   fields.servings ?? null,
    note:       fields.note ?? null,
  };
}

export const mealPlanEntryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      mealPlanId: data.mealPlanId,
      recipeId:   data.recipeId,
      planDate:   data.planDate,
      mealType:   data.mealType,
      servings:   data.servings ?? null,
      note:       data.note ?? null,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "meal_plan_entries"
 *   - mealPlanId ASC, planDate ASC, mealType ASC
 */
