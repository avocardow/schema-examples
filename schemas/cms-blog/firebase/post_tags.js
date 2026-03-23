// post_tags: Many-to-many relationship between posts and tags.
// See README.md for full design rationale.

/**
 * @typedef {Object} PostTagDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} tagId - FK → tags
 * @property {number} sortOrder
 */

export function createPostTag(fields) {
  return {
    postId: fields.postId,
    tagId: fields.tagId,
    sortOrder: fields.sortOrder ?? 0,
  };
}

export const postTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      tagId: data.tagId,
      sortOrder: data.sortOrder,
    };
  },
};

/*
  Suggested Firestore indexes:
  - post_tags: postId ASC, sortOrder ASC
  - post_tags: tagId ASC
*/
