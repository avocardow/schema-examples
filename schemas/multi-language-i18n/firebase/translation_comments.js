// translation_comments: Discussion threads on translations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TranslationCommentDocument
 * @property {string}      id
 * @property {string}      translationType
 * @property {string}      translationId
 * @property {string|null} parentId
 * @property {string}      authorId
 * @property {string}      body
 * @property {string|null} issueType
 * @property {boolean}     isResolved
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<TranslationCommentDocument, "translationType" | "translationId" | "authorId" | "body"> & Partial<Pick<TranslationCommentDocument, "parentId" | "issueType" | "isResolved">>} fields
 * @returns {Omit<TranslationCommentDocument, "id">}
 */
export function createTranslationComment(fields) {
  return {
    translationType: fields.translationType,
    translationId:   fields.translationId,
    parentId:        fields.parentId  ?? null,
    authorId:        fields.authorId,
    body:            fields.body,
    issueType:       fields.issueType ?? null,
    isResolved:      fields.isResolved ?? false,
    createdAt:       Timestamp.now(),
    updatedAt:       Timestamp.now(),
  };
}

export const translationCommentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      translationType: data.translationType,
      translationId:   data.translationId,
      parentId:        data.parentId  ?? null,
      authorId:        data.authorId,
      body:            data.body,
      issueType:       data.issueType ?? null,
      isResolved:      data.isResolved ?? false,
      createdAt:       data.createdAt,
      updatedAt:       data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - translation_comments.translationType ASC + translation_comments.translationId ASC
 *
 * Single-field:
 *   - translation_comments.parentId ASC
 *   - translation_comments.authorId ASC
 */
