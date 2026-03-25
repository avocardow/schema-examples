// ticket_attachments: files attached to ticket messages with metadata.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TicketAttachmentDocument
 * @property {string} id
 * @property {string} ticketId - FK → tickets
 * @property {string | null} messageId - FK → ticket_messages
 * @property {string} fileName
 * @property {string} fileUrl
 * @property {number | null} fileSize
 * @property {string | null} mimeType
 * @property {string} uploadedBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TicketAttachmentDocument, "id" | "createdAt">} fields
 * @returns {Omit<TicketAttachmentDocument, "id">}
 */
export function createTicketAttachment(fields) {
  return {
    ticketId: fields.ticketId,
    messageId: fields.messageId ?? null,
    fileName: fields.fileName,
    fileUrl: fields.fileUrl,
    fileSize: fields.fileSize ?? null,
    mimeType: fields.mimeType ?? null,
    uploadedBy: fields.uploadedBy,
    createdAt: Timestamp.now(),
  };
}

export const ticketAttachmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ticketId: data.ticketId,
      messageId: data.messageId ?? null,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize ?? null,
      mimeType: data.mimeType ?? null,
      uploadedBy: data.uploadedBy,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_attachments"
 *   - ticketId ASC
 *   - messageId ASC
 */
