// task_attachments: file attachments uploaded to tasks.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TaskAttachmentDocument
 * @property {string} id
 * @property {string} taskId - FK → tasks
 * @property {string | null} uploadedBy - FK → users
 * @property {string} fileName
 * @property {string} fileUrl
 * @property {number | null} fileSize
 * @property {string | null} mimeType
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TaskAttachmentDocument, "id" | "createdAt">} fields
 * @returns {Omit<TaskAttachmentDocument, "id">}
 */
export function createTaskAttachment(fields) {
  return {
    taskId: fields.taskId,
    uploadedBy: fields.uploadedBy ?? null,
    fileName: fields.fileName,
    fileUrl: fields.fileUrl,
    fileSize: fields.fileSize ?? null,
    mimeType: fields.mimeType ?? null,
    createdAt: Timestamp.now(),
  };
}

export const taskAttachmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      taskId: data.taskId,
      uploadedBy: data.uploadedBy ?? null,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize ?? null,
      mimeType: data.mimeType ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "task_attachments"
 *   - taskId ASC
 *   - uploadedBy ASC
 */
