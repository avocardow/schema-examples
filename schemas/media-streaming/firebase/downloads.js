// downloads: offline track downloads and their status.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DOWNLOAD_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  DOWNLOADING: "downloading",
  COMPLETED: "completed",
  EXPIRED: "expired",
  FAILED: "failed",
});

/**
 * @typedef {Object} DownloadDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} trackId - FK → tracks
 * @property {string} trackFileId - FK → track_files
 * @property {typeof DOWNLOAD_STATUS[keyof typeof DOWNLOAD_STATUS]} status
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {import("firebase/firestore").Timestamp | null} downloadedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<DownloadDocument, "id" | "createdAt">} fields
 * @returns {Omit<DownloadDocument, "id">}
 */
export function createDownload(fields) {
  return {
    userId: fields.userId,
    trackId: fields.trackId,
    trackFileId: fields.trackFileId,
    status: fields.status ?? DOWNLOAD_STATUS.PENDING,
    expiresAt: fields.expiresAt ?? null,
    downloadedAt: fields.downloadedAt ?? null,
    createdAt: Timestamp.now(),
  };
}

export const downloadConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      trackId: data.trackId,
      trackFileId: data.trackFileId,
      status: data.status,
      expiresAt: data.expiresAt ?? null,
      downloadedAt: data.downloadedAt ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - userId ASC, status ASC, createdAt DESC
 *   - userId ASC, createdAt DESC
 *   - status ASC, expiresAt ASC
 */
