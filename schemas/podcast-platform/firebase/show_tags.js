// show_tags: Free-form tags associated with shows.
// See README.md for full design rationale.

/**
 * @typedef {Object} ShowTagDocument
 * @property {string} id
 * @property {string} showId - FK → shows
 * @property {string} tag
 */

/**
 * @param {Omit<ShowTagDocument, "id">} fields
 * @returns {Omit<ShowTagDocument, "id">}
 */
export function createShowTag(fields) {
  return {
    showId: fields.showId,
    tag: fields.tag,
  };
}

export const showTagConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      showId: data.showId,
      tag: data.tag,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - showId ASC, tag ASC
 *   - tag ASC
 */
