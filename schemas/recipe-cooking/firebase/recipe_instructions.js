// recipe_instructions: Step-by-step cooking instructions for a recipe.
// See README.md for full design rationale.

/**
 * @typedef {Object} RecipeInstructionDocument
 * @property {string} id
 * @property {string} recipeId - FK → recipes
 * @property {number} stepNumber
 * @property {string} instruction
 * @property {string|null} sectionLabel
 * @property {number|null} timeMinutes
 */

/**
 * @param {Omit<RecipeInstructionDocument, "id">} fields
 * @returns {Omit<RecipeInstructionDocument, "id">}
 */
export function createRecipeInstruction(fields) {
  return {
    recipeId:     fields.recipeId,
    stepNumber:   fields.stepNumber,
    instruction:  fields.instruction,
    sectionLabel: fields.sectionLabel ?? null,
    timeMinutes:  fields.timeMinutes ?? null,
  };
}

export const recipeInstructionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      recipeId:     data.recipeId,
      stepNumber:   data.stepNumber,
      instruction:  data.instruction,
      sectionLabel: data.sectionLabel ?? null,
      timeMinutes:  data.timeMinutes ?? null,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "recipe_instructions"
 *   - recipeId ASC, stepNumber ASC
 */
