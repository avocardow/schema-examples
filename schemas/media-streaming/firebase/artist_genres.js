// artist_genres: many-to-many relationship between artists and genres.
// See README.md for full design rationale.

/**
 * @typedef {Object} ArtistGenreDocument
 * @property {string} id
 * @property {string} artistId - FK → artists
 * @property {string} genreId - FK → genres
 */

/**
 * @param {Omit<ArtistGenreDocument, "id">} fields
 * @returns {Omit<ArtistGenreDocument, "id">}
 */
export function createArtistGenre(fields) {
  return {
    artistId: fields.artistId,
    genreId: fields.genreId,
  };
}

export const artistGenreConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      artistId: data.artistId,
      genreId: data.genreId,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - artistId ASC
 *   - genreId  ASC
 */
