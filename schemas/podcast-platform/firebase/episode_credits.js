// episode_credits: Credit assignments linking people to episodes with roles.
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
 * @typedef {Object} EpisodeCreditDocument
 * @property {string} id
 * @property {string} episodeId - FK → episodes
 * @property {string} personId - FK → people
 * @property {typeof CREDIT_ROLE[keyof typeof CREDIT_ROLE]} role
 * @property {typeof CREDIT_GROUP[keyof typeof CREDIT_GROUP]} group
 * @property {number} position
 */

/**
 * @param {Omit<EpisodeCreditDocument, "id">} fields
 * @returns {Omit<EpisodeCreditDocument, "id">}
 */
export function createEpisodeCredit(fields) {
  return {
    episodeId: fields.episodeId,
    personId: fields.personId,
    role: fields.role,
    group: fields.group ?? CREDIT_GROUP.CAST,
    position: fields.position ?? 0,
  };
}

export const episodeCreditConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      episodeId: data.episodeId,
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
 *   - episodeId ASC, personId ASC, role ASC
 */
