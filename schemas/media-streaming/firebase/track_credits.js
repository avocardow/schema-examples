// track_credits: artist roles and credits for tracks.
// See README.md for full design rationale.

export const CREDIT_ROLE = /** @type {const} */ ({
  PRIMARY_ARTIST: "primary_artist",
  FEATURED_ARTIST: "featured_artist",
  WRITER: "writer",
  PRODUCER: "producer",
  COMPOSER: "composer",
  MIXER: "mixer",
  ENGINEER: "engineer",
});

/**
 * @typedef {Object} TrackCreditDocument
 * @property {string} id
 * @property {string} trackId - FK → tracks
 * @property {string} artistId - FK → artists
 * @property {typeof CREDIT_ROLE[keyof typeof CREDIT_ROLE]} role
 */

/**
 * @param {Omit<TrackCreditDocument, "id">} fields
 * @returns {Omit<TrackCreditDocument, "id">}
 */
export function createTrackCredit(fields) {
  return {
    trackId: fields.trackId,
    artistId: fields.artistId,
    role: fields.role,
  };
}

export const trackCreditConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      trackId: data.trackId,
      artistId: data.artistId,
      role: data.role,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - trackId ASC, role ASC
 *   - artistId ASC, role ASC
 */
