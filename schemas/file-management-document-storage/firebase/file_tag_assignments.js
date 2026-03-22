// file_tag_assignments: Many-to-many join between files and tags with audit trail.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_tag_assignments"
 * Document ID: Deterministic — `${fileId}_${tagId}`
 *
 * Firestore has no composite unique constraint, so uniqueness on (fileId, tagId) is
 * enforced via a deterministic document ID.
 * Using a deterministic ID is the recommended approach — it makes idempotent writes trivial.
 *
 * Security notes:
 *   - When a file is deleted, cascade-delete its file_tag_assignments documents in the same batch.
 *   - When a tag is deleted, cascade-delete its file_tag_assignments documents as well.
 */

/**
 * @typedef {Object} FileTagAssignmentDocument
 * @property {string}    fileId    - Reference to the files document.
 * @property {string}    tagId     - Reference to the file_tags document.
 * @property {string}    taggedBy  - Reference to the users document. Who applied this tag.
 * @property {Timestamp} createdAt
 */

/**
 * Returns a deterministic document ID for a (fileId, tagId) pair.
 * Use this as the document ID to enforce uniqueness without a transaction.
 *
 * @param {string} fileId
 * @param {string} tagId
 * @returns {string}
 */
export function fileTagAssignmentDocId(fileId, tagId) {
  return `${fileId}_${tagId}`;
}

/**
 * @param {{ fileId: string; tagId: string; taggedBy: string }} fields
 * @returns {Omit<FileTagAssignmentDocument, "id">}
 */
export function createFileTagAssignment(fields) {
  return {
    fileId:    fields.fileId,
    tagId:     fields.tagId,
    taggedBy:  fields.taggedBy,
    createdAt: Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_tag_assignments").withConverter(fileTagAssignmentConverter)
 */
export const fileTagAssignmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      fileId:    data.fileId,
      tagId:     data.tagId,
      taggedBy:  data.taggedBy,
      createdAt: data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_tag_assignments.fileId    ASC  — "All tags on this file."
 *   - file_tag_assignments.tagId     ASC  — "All files with this tag."
 *   - file_tag_assignments.taggedBy  ASC  — "All tags applied by this user."
 */
