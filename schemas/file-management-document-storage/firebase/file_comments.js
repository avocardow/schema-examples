// file_comments: Threaded comments on files — supports nested replies via parentId self-reference and resolved state for review workflows.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_comments"
 * Document ID: Firestore auto-generated or UUID
 *
 * Threaded comments on files. Supports nested replies via parentId
 * self-reference. Comments can be marked as resolved for review workflows.
 * Only files can be commented on — folder-level discussions are out of scope.
 */

/**
 * @typedef {Object} FileCommentDocument
 * @property {string}      id          - Document ID (from snapshot.id).
 * @property {string}      fileId      - Reference to the file being commented on.
 * @property {string|null} parentId    - Parent comment for threaded replies. Null = top-level comment.
 * @property {string}      authorId    - Reference to the user who wrote this comment.
 * @property {string}      body        - Comment text. Supports plain text or markdown.
 * @property {boolean}     isResolved  - Whether this comment thread is resolved.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<FileCommentDocument, "fileId" | "authorId" | "body"> & Partial<Pick<FileCommentDocument, "parentId" | "isResolved">>} fields
 * @returns {Omit<FileCommentDocument, "id">}
 */
export function createFileComment(fields) {
  return {
    fileId:     fields.fileId,
    parentId:   fields.parentId   ?? null,
    authorId:   fields.authorId,
    body:       fields.body,
    isResolved: fields.isResolved ?? false,
    createdAt:  Timestamp.now(),
    updatedAt:  Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_comments").withConverter(fileCommentConverter)
 */
export const fileCommentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      fileId:     data.fileId,
      parentId:   data.parentId   ?? null,
      authorId:   data.authorId,
      body:       data.body,
      isResolved: data.isResolved ?? false,
      createdAt:  data.createdAt,            // Timestamp
      updatedAt:  data.updatedAt,            // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - file_comments (fileId ASC, createdAt ASC) — "All comments on this file, chronological."
 *
 * Single-field:
 *   - file_comments.parentId   ASC — "All replies to this comment."
 *   - file_comments.authorId   ASC — "All comments by this user."
 */
