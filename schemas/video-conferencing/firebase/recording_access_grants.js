// recording_access_grants: permissions granted to users for viewing or downloading recordings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const RECORDING_PERMISSIONS = /** @type {const} */ ({
  VIEW: "view",
  DOWNLOAD: "download",
});

/**
 * @typedef {Object} RecordingAccessGrantDocument
 * @property {string} id
 * @property {string} recordingId - FK → recordings
 * @property {string} grantedTo - FK → users
 * @property {string} grantedBy - FK → users
 * @property {typeof RECORDING_PERMISSIONS[keyof typeof RECORDING_PERMISSIONS]} permission
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createRecordingAccessGrant(fields) {
  return {
    recordingId: fields.recordingId,
    grantedTo: fields.grantedTo,
    grantedBy: fields.grantedBy,
    permission: fields.permission ?? RECORDING_PERMISSIONS.VIEW,
    expiresAt: fields.expiresAt ?? null,
    createdAt: Timestamp.now(),
  };
}

export const recordingAccessGrantConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      recordingId: data.recordingId,
      grantedTo: data.grantedTo,
      grantedBy: data.grantedBy,
      permission: data.permission,
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - recording_access_grants: recordingId ASC, grantedTo ASC
 *   - recording_access_grants: grantedTo ASC, createdAt DESC
 */
