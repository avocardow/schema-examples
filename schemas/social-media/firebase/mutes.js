// mutes: user-to-user mute relationships with optional expiration.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MuteDocument
 * @property {string} id
 * @property {string} muterId - FK → users
 * @property {string} mutedId - FK → users
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<MuteDocument, "id" | "createdAt">} fields
 * @returns {Omit<MuteDocument, "id">}
 */
export function createMute(fields) {
  return {
    muterId: fields.muterId,
    mutedId: fields.mutedId,
    expiresAt: fields.expiresAt ?? null,
    createdAt: Timestamp.now(),
  };
}

export const muteConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      muterId: data.muterId,
      mutedId: data.mutedId,
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - muterId   ASC
 *   - mutedId   ASC
 *   - expiresAt ASC
 *
 * Composite indexes:
 *   - muterId ASC, mutedId ASC
 */
