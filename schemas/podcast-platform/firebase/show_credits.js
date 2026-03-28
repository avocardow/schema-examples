// show_credits: Credit assignments linking people to shows with roles.
// See README.md for full design rationale.

export const CREDIT_ROLE = /** @type {const} */ ({
  HOST: "host",
  CO_HOST: "co_host",
  GUEST: "guest",
  PRODUCER: "producer",
  EDITOR: "editor",
  SOUND_DESIGNER: "sound_designer",
  COMPOSER: "composer",
  NARRATOR: "narrator",
  RESEARCHER: "researcher",
  WRITER: "writer",
});

export const CREDIT_GROUP = /** @type {const} */ ({
  CAST: "cast",
  CREW: "crew",
  WRITING: "writing",
  AUDIO_POST_PRODUCTION: "audio_post_production",
  VIDEO_POST_PRODUCTION: "video_post_production",
});

/**
 * @typedef {Object} ShowCreditDocument
 * @property {string} id
 * @property {string} showId - FK → shows
 * @property {string} personId - FK → people
 * @property {typeof CREDIT_ROLE[keyof typeof CREDIT_ROLE]} role
 * @property {typeof CREDIT_GROUP[keyof typeof CREDIT_GROUP]} group
 * @property {number} position
 */

/**
 * @param {Omit<ShowCreditDocument, "id">} fields
 * @returns {Omit<ShowCreditDocument, "id">}
 */
export function createShowCredit(fields) {
  return {
    showId: fields.showId,
    personId: fields.personId,
    role: fields.role,
    group: fields.group ?? CREDIT_GROUP.CAST,
    position: fields.position ?? 0,
  };
}

export const showCreditConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      showId: data.showId,
      personId: data.personId,
      role: data.role,
      group: data.group,
      position: data.position,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - personId ASC
 *
 * Composite indexes:
 *   - showId ASC, personId ASC, role ASC
 */
