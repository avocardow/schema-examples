// post_authors: Many-to-many relationship between posts and authors with roles.
// See README.md for full design rationale.

export const POST_AUTHOR_ROLE = /** @type {const} */ ({
  AUTHOR: "author",
  CONTRIBUTOR: "contributor",
  EDITOR: "editor",
  GUEST: "guest",
});

/**
 * @typedef {Object} PostAuthorDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} authorId - FK → authors
 * @property {number} sortOrder
 * @property {string} role
 */

export function createPostAuthor(fields) {
  return {
    postId: fields.postId,
    authorId: fields.authorId,
    sortOrder: fields.sortOrder ?? 0,
    role: fields.role ?? "author",
  };
}

export const postAuthorConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      authorId: data.authorId,
      sortOrder: data.sortOrder,
      role: data.role,
    };
  },
};

/*
  Suggested Firestore indexes:
  - post_authors: postId ASC, sortOrder ASC
  - post_authors: authorId ASC
*/
