// recipe_tags: Many-to-many join between recipes and tags.
// See README.md for full design rationale.

/**
 * @typedef {Object} RecipeTagDocument
 * @property {string} id
 * @property {string} recipeId - FK → recipes
 * @property {string} tagId - FK → tags
 */

/**
 * @param {Omit<RecipeTagDocument, "id">} fields
 * @returns {Omit<RecipeTagDocument, "id">}
 */
export function createRecipeTag(fields) {
  return {
    recipeId: fields.recipeId,
    tagId:    fields.tagId,
  };
}

export const recipeTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:       snapshot.id,
      recipeId: data.recipeId,
      tagId:    data.tagId,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "recipe_tags"
 *   - recipeId ASC, tagId ASC
 *   - tagId ASC, recipeId ASC
 */
