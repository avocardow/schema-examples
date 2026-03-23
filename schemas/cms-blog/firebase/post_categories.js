// post_categories: Many-to-many relationship between posts and categories.
// See README.md for full design rationale.

/**
 * @typedef {Object} PostCategoryDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} categoryId - FK → categories
 */

export function createPostCategory(fields) {
  return {
    postId: fields.postId,
    categoryId: fields.categoryId,
  };
}

export const postCategoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      categoryId: data.categoryId,
    };
  },
};

/*
  Suggested Firestore indexes:
  - post_categories: postId ASC
  - post_categories: categoryId ASC
*/
