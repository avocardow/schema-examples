// recipe_ingredients: Ingredients linked to a recipe with quantity and ordering.
// See README.md for full design rationale.

/**
 * @typedef {Object} RecipeIngredientDocument
 * @property {string} id
 * @property {string} recipeId - FK → recipes
 * @property {string} foodId - FK → foods
 * @property {string|null} unitId - FK → units
 * @property {number|null} quantity
 * @property {string|null} note
 * @property {string|null} sectionLabel
 * @property {number} position
 * @property {boolean} optional
 */

/**
 * @param {Omit<RecipeIngredientDocument, "id">} fields
 * @returns {Omit<RecipeIngredientDocument, "id">}
 */
export function createRecipeIngredient(fields) {
  return {
    recipeId:     fields.recipeId,
    foodId:       fields.foodId,
    unitId:       fields.unitId ?? null,
    quantity:     fields.quantity ?? null,
    note:         fields.note ?? null,
    sectionLabel: fields.sectionLabel ?? null,
    position:     fields.position ?? 0,
    optional:     fields.optional ?? false,
  };
}

export const recipeIngredientConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      recipeId:     data.recipeId,
      foodId:       data.foodId,
      unitId:       data.unitId ?? null,
      quantity:     data.quantity ?? null,
      note:         data.note ?? null,
      sectionLabel: data.sectionLabel ?? null,
      position:     data.position,
      optional:     data.optional,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "recipe_ingredients"
 *   - recipeId ASC, position ASC
 */
