// user_presence: Tracks real-time online/away/busy/offline status per user.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PRESENCE_STATUS = /** @type {const} */ ({
  ONLINE: "online",
  AWAY: "away",
  BUSY: "busy",
  OFFLINE: "offline",
});

/**
 * @typedef {Object} UserPresenceDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {typeof PRESENCE_STATUS[keyof typeof PRESENCE_STATUS]} status
 * @property {string | null} statusText
 * @property {string | null} statusEmoji
 * @property {import("firebase/firestore").Timestamp | null} lastActiveAt
 * @property {import("firebase/firestore").Timestamp | null} lastConnectedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createUserPresence(fields) {
  return {
    userId: fields.userId,
    status: fields.status ?? "offline",
    statusText: fields.statusText ?? null,
    statusEmoji: fields.statusEmoji ?? null,
    lastActiveAt: fields.lastActiveAt ?? null,
    lastConnectedAt: fields.lastConnectedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const userPresenceConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      status: data.status,
      statusText: data.statusText ?? null,
      statusEmoji: data.statusEmoji ?? null,
      lastActiveAt: data.lastActiveAt ?? null,
      lastConnectedAt: data.lastConnectedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - userId ASC
 *   - status ASC
 *
 * Composite indexes:
 *   - status ASC, lastActiveAt DESC
 */
