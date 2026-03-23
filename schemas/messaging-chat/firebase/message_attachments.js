// message_attachments: files attached to a chat message.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MessageAttachmentDocument
 * @property {string} id
 * @property {string} messageId - FK → messages
 * @property {string} fileId - FK → files
 * @property {string} fileName
 * @property {number} fileSize
 * @property {string} mimeType
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createMessageAttachment(fields) {
  return {
    messageId: fields.messageId,
    fileId: fields.fileId,
    fileName: fields.fileName,
    fileSize: fields.fileSize,
    mimeType: fields.mimeType,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const messageAttachmentConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      messageId: data.messageId,
      fileId: data.fileId,
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      position: data.position,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - messageId   ASC
 *   - fileId      ASC
 */
