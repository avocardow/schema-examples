// post_meta: Flexible key-value metadata for posts.
// See README.md for full design rationale.

/**
 * @typedef {Object} PostMetaDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} metaKey
 * @property {string|null} metaValue
 */

export function createPostMeta(fields) {
  return {
    postId: fields.postId,
    metaKey: fields.metaKey,
    metaValue: fields.metaValue ?? null,
  };
}

export const postMetaConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      metaKey: data.metaKey,
      metaValue: data.metaValue ?? null,
    };
  },
};

/*
  Suggested Firestore indexes:
  - post_meta: postId ASC, metaKey ASC
  - post_meta: metaKey ASC
*/
