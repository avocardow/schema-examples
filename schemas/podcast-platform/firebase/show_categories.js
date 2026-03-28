// show_categories: Many-to-many mapping of shows to categories.
// See README.md for full design rationale.

/**
 * @typedef {Object} ShowCategoryDocument
 * @property {string} id
 * @property {string} showId - FK → shows
 * @property {string} categoryId - FK → categories
 * @property {boolean} isPrimary
 */

/**
 * @param {Omit<ShowCategoryDocument, "id">} fields
 * @returns {Omit<ShowCategoryDocument, "id">}
 */
export function createShowCategory(fields) {
  return {
    showId: fields.showId,
    categoryId: fields.categoryId,
    isPrimary: fields.isPrimary ?? false,
  };
}

export const showCategoryConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      showId: data.showId,
      categoryId: data.categoryId,
      isPrimary: data.isPrimary,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - categoryId ASC
 *
 * Composite indexes:
 *   - showId ASC, categoryId ASC
 */
