// templates: Reusable email templates with HTML and plain-text bodies.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TemplateDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} subject
 * @property {string|null} htmlBody
 * @property {string|null} textBody
 * @property {string|null} fromName
 * @property {string|null} fromEmail
 * @property {string|null} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TemplateDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TemplateDocument, "id">}
 */
export function createTemplate(fields) {
  const now = Timestamp.now();
  return {
    name:      fields.name,
    subject:   fields.subject   ?? null,
    htmlBody:  fields.htmlBody  ?? null,
    textBody:  fields.textBody  ?? null,
    fromName:  fields.fromName  ?? null,
    fromEmail: fields.fromEmail ?? null,
    createdBy: fields.createdBy ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export const templateConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      name:      data.name,
      subject:   data.subject   ?? null,
      htmlBody:  data.htmlBody  ?? null,
      textBody:  data.textBody  ?? null,
      fromName:  data.fromName  ?? null,
      fromEmail: data.fromEmail ?? null,
      createdBy: data.createdBy ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - templates.createdBy  ASC  — Filter templates by creator.
 */
