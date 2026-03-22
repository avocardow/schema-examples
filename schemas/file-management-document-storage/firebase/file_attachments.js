// file_attachments: Polymorphic join table — attach files to any entity in any domain.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_attachments"
 * Document ID: Firestore auto-generated or UUID
 *
 * Attach files to any entity in any domain. The record_type/record_id/name triple
 * identifies the attachment slot: what entity, which instance, and what purpose.
 * Attachments are immutable links — to change an attachment, delete and recreate.
 */

/**
 * @typedef {Object} FileAttachmentDocument
 * @property {string}    fileId     - Reference to a files document. The attached file.
 * @property {string}    recordType - Entity type (e.g., "products", "users", "posts", "tickets"). Polymorphic — not a FK.
 * @property {string}    recordId   - Entity primary key (UUID). Polymorphic — not a FK.
 * @property {string}    name       - Attachment slot/purpose (e.g., "avatar", "cover_image", "documents").
 * @property {number}    position   - Ordering within a slot. Allows drag-and-drop reordering.
 * @property {Timestamp} createdAt
 */

/**
 * @param {Pick<FileAttachmentDocument, "fileId" | "recordType" | "recordId" | "name"> & Partial<Pick<FileAttachmentDocument, "position">>} fields
 * @returns {Omit<FileAttachmentDocument, "id">}
 */
export function createFileAttachment(fields) {
  return {
    fileId:     fields.fileId,
    recordType: fields.recordType,
    recordId:   fields.recordId,
    name:       fields.name,
    position:   fields.position   ?? 0,
    createdAt:  Timestamp.now(),
    // No updatedAt — attachments are immutable links.
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_attachments").withConverter(fileAttachmentConverter)
 */
export const fileAttachmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      fileId:     data.fileId,
      recordType: data.recordType,
      recordId:   data.recordId,
      name:       data.name,
      position:   data.position   ?? 0,
      createdAt:  data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - file_attachments: recordType ASC, recordId ASC, name ASC, fileId ASC — Unique slot constraint.
 *   - file_attachments: recordType ASC, recordId ASC, name ASC            — "All files in this slot."
 *   - file_attachments: recordType ASC, recordId ASC                      — "All attachments for this entity."
 *
 * Single-field:
 *   - file_attachments.fileId ASC — "Where is this file used?" — orphan detection.
 */
