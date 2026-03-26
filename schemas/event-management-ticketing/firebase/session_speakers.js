// session_speakers: Junction linking speakers to sessions with their role.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const SPEAKER_ROLES = /** @type {const} */ ({
  SPEAKER: "speaker",
  MODERATOR: "moderator",
  PANELIST: "panelist",
  HOST: "host",
  KEYNOTE: "keynote",
});

/**
 * @typedef {Object} SessionSpeakerDocument
 * @property {string} id
 * @property {string} sessionId - FK → event_sessions
 * @property {string} speakerId - FK → speakers
 * @property {typeof SPEAKER_ROLES[keyof typeof SPEAKER_ROLES]} role
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<SessionSpeakerDocument, "id" | "createdAt">} fields
 * @returns {Omit<SessionSpeakerDocument, "id">}
 */
export function createSessionSpeaker(fields) {
  return {
    sessionId: fields.sessionId,
    speakerId: fields.speakerId,
    role: fields.role ?? SPEAKER_ROLES.SPEAKER,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const sessionSpeakerConverter = {
  /** @param {Omit<SessionSpeakerDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      sessionId: data.sessionId,
      speakerId: data.speakerId,
      role: data.role,
      position: data.position,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "session_speakers"
 *   - sessionId (ASC), position (ASC)
 *   - speakerId (ASC)
 */
