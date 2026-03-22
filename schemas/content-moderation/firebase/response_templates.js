// response_templates: Pre-written response messages for moderator actions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "response_templates"
 * Document ID: Firestore auto-generated
 *
 * Design notes:
 *   - actionType is nullable — null means the template is usable with any action type.
 *   - scope discriminates whether a template is global or community-specific.
 *     When scope = "community", scopeId holds the community ID; otherwise scopeId is null.
 *   - content may include placeholders like {{username}}, {{rule}}, {{appeal_url}}.
 */

export const RESPONSE_TEMPLATE_ACTION_TYPE = /** @type {const} */ ({
  APPROVE:  "approve",
  REMOVE:   "remove",
  WARN:     "warn",
  MUTE:     "mute",
  BAN:      "ban",
  RESTRICT: "restrict",
  ESCALATE: "escalate",
  LABEL:    "label",
});

export const RESPONSE_TEMPLATE_SCOPE = /** @type {const} */ ({
  GLOBAL:    "global",
  COMMUNITY: "community",
});

/**
 * @typedef {Object} ResponseTemplateDocument
 * @property {string}         id                    - Document ID (from snapshot.id).
 * @property {string}         name                  - Internal template name (e.g., "Spam Removal — First Offense").
 * @property {typeof RESPONSE_TEMPLATE_ACTION_TYPE[keyof typeof RESPONSE_TEMPLATE_ACTION_TYPE]|null} actionType - Which moderation action this template is for. Null = any action.
 * @property {string}         content               - Template text with optional placeholders.
 * @property {string|null}    violationCategoryId   - FK → violation_categories. Suggested category for this template.
 * @property {typeof RESPONSE_TEMPLATE_SCOPE[keyof typeof RESPONSE_TEMPLATE_SCOPE]} scope - "global" or "community".
 * @property {string|null}    scopeId               - Community ID when scope = "community". Null when global.
 * @property {boolean}        isActive
 * @property {string}         createdBy             - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ResponseTemplateDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ResponseTemplateDocument, "id">}
 */
export function createResponseTemplate(fields) {
  return {
    name:                fields.name,
    actionType:          fields.actionType          ?? null,
    content:             fields.content,
    violationCategoryId: fields.violationCategoryId ?? null,
    scope:               fields.scope               ?? RESPONSE_TEMPLATE_SCOPE.GLOBAL,
    scopeId:             fields.scopeId             ?? null,
    isActive:            fields.isActive            ?? true,
    createdBy:           fields.createdBy,
    createdAt:           Timestamp.now(),
    updatedAt:           Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("response_templates").withConverter(responseTemplateConverter)
 */
export const responseTemplateConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                  snapshot.id,
      name:                data.name,
      actionType:          data.actionType          ?? null,
      content:             data.content,
      violationCategoryId: data.violationCategoryId ?? null,
      scope:               data.scope,
      scopeId:             data.scopeId             ?? null,
      isActive:            data.isActive,
      createdBy:           data.createdBy,
      createdAt:           data.createdAt,
      updatedAt:           data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - response_templates.scope     ASC
 *     response_templates.scopeId   ASC
 *     — "All templates for this community."
 *
 * Single-field:
 *   - response_templates.actionType          ASC  — "All templates for removal actions."
 *   - response_templates.violationCategoryId ASC  — "All templates for hate speech violations."
 *   - response_templates.isActive            ASC  — "All active templates."
 */
