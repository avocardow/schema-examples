// series_items: Posts belonging to a series with ordering.
// See README.md for full design rationale.

/**
 * @typedef {Object} SeriesItemDocument
 * @property {string} id
 * @property {string} seriesId - FK → series
 * @property {string} postId - FK → posts
 * @property {number} sortOrder
 */

export function createSeriesItem(fields) {
  return {
    seriesId: fields.seriesId,
    postId: fields.postId,
    sortOrder: fields.sortOrder ?? 0,
  };
}

export const seriesItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      seriesId: data.seriesId,
      postId: data.postId,
      sortOrder: data.sortOrder,
    };
  },
};

/*
  Suggested Firestore indexes:
  - series_items: seriesId ASC, sortOrder ASC
  - series_items: postId ASC
*/
