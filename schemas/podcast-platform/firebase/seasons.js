// seasons: Grouping of episodes into numbered seasons within a show.
// See README.md for full design rationale.

/**
 * @typedef {Object} SeasonDocument
 * @property {string} id
 * @property {string} showId - FK → shows
 * @property {number} seasonNumber
 * @property {string | null} name
 * @property {string | null} description
 * @property {string | null} artworkFileId - FK → files
 */

/**
 * @param {Omit<SeasonDocument, "id">} fields
 * @returns {Omit<SeasonDocument, "id">}
 */
export function createSeason(fields) {
  return {
    showId: fields.showId,
    seasonNumber: fields.seasonNumber,
    name: fields.name ?? null,
    description: fields.description ?? null,
    artworkFileId: fields.artworkFileId ?? null,
  };
}

export const seasonConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      showId: data.showId,
      seasonNumber: data.seasonNumber,
      name: data.name ?? null,
      description: data.description ?? null,
      artworkFileId: data.artworkFileId ?? null,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - showId ASC, seasonNumber ASC
 */
