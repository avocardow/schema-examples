// file_tags: Tag definitions for organizing files with visibility levels (public, private, system).
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_tags"
 * Document ID: Firestore auto-generated or UUID
 *
 * Tags organize files with a visibility level: public (visible to all), private (visible only
 * to the creator), or system (admin-managed, visible to all but only admins can assign).
 * Inspired by Nextcloud's system tags.
 */

export const FILE_TAG_VISIBILITY = /** @type {const} */ ({
  PUBLIC: "public",
  PRIVATE: "private",
  SYSTEM: "system",
});

/**
 * @typedef {Object} FileTagDocument
 * @property {string}      name        - Tag name (e.g., "important", "reviewed", "needs-update").
 * @property {string|null} color       - Hex color for UI display (e.g., "#ff5733").
 * @property {string}      visibility  - One of "public", "private", "system". Default "public".
 * @property {string|null} description - Explain what this tag means or when to use it.
 * @property {string}      createdBy   - Reference to a users document.
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<FileTagDocument, "name" | "createdBy"> & Partial<Pick<FileTagDocument, "color" | "visibility" | "description">>} fields
 * @returns {Omit<FileTagDocument, "id">}
 */
export function createFileTag(fields) {
  return {
    name:        fields.name,
    color:       fields.color       ?? null,
    visibility:  fields.visibility  ?? FILE_TAG_VISIBILITY.PUBLIC,
    description: fields.description ?? null,
    createdBy:   fields.createdBy,
    createdAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_tags").withConverter(fileTagConverter)
 */
export const fileTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      color:       data.color       ?? null,
      visibility:  data.visibility  ?? FILE_TAG_VISIBILITY.PUBLIC,
      description: data.description ?? null,
      createdBy:   data.createdBy,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_tags.name        ASC  — Unique lookup by tag name.
 *   - file_tags.visibility  ASC  — "All public tags" or "all system tags."
 */
