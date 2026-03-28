// episode_downloads: Offline episode download tracking per user and device.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const EPISODE_DOWNLOAD_STATUS = /** @type {const} */ ({
  QUEUED: "queued",
  DOWNLOADING: "downloading",
  COMPLETED: "completed",
  FAILED: "failed",
  EXPIRED: "expired",
});

/**
 * @typedef {Object} EpisodeDownloadDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} episodeId - FK → episodes
 * @property {typeof EPISODE_DOWNLOAD_STATUS[keyof typeof EPISODE_DOWNLOAD_STATUS]} status
 * @property {string | null} deviceId
 * @property {number | null} fileSizeBytes
 * @property {import("firebase/firestore").Timestamp | null} downloadedAt
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<EpisodeDownloadDocument, "id" | "createdAt">} fields
 * @returns {Omit<EpisodeDownloadDocument, "id">}
 */
export function createEpisodeDownload(fields) {
  return {
    userId: fields.userId,
    episodeId: fields.episodeId,
    status: fields.status ?? EPISODE_DOWNLOAD_STATUS.QUEUED,
    deviceId: fields.deviceId ?? null,
    fileSizeBytes: fields.fileSizeBytes ?? null,
    downloadedAt: fields.downloadedAt ?? null,
    expiresAt: fields.expiresAt ?? null,
    createdAt: Timestamp.now(),
  };
}

export const episodeDownloadConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      episodeId: data.episodeId,
      status: data.status,
      deviceId: data.deviceId ?? null,
      fileSizeBytes: data.fileSizeBytes ?? null,
      downloadedAt: data.downloadedAt ?? null,
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - expiresAt ASC
 *
 * Composite indexes:
 *   - userId ASC, status ASC
 *   - userId ASC, episodeId ASC, deviceId ASC
 */
