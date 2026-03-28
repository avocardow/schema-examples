// album_tracks: track listings within albums with disc and position ordering.
// See README.md for full design rationale.

/**
 * @typedef {Object} AlbumTrackDocument
 * @property {string} id
 * @property {string} albumId - FK → albums
 * @property {string} trackId - FK → tracks
 * @property {number} discNumber
 * @property {number} position
 */

/**
 * @param {Omit<AlbumTrackDocument, "id">} fields
 * @returns {Omit<AlbumTrackDocument, "id">}
 */
export function createAlbumTrack(fields) {
  return {
    albumId: fields.albumId,
    trackId: fields.trackId,
    discNumber: fields.discNumber ?? 1,
    position: fields.position,
  };
}

export const albumTrackConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      albumId: data.albumId,
      trackId: data.trackId,
      discNumber: data.discNumber,
      position: data.position,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - trackId ASC
 *
 * Composite indexes:
 *   - albumId ASC, discNumber ASC, position ASC
 */
