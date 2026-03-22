// notification_templates: Reusable content definitions for a notification category.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_templates"
 * Document ID: Firestore auto-generated or UUID
 *
 * Templates contain interpolatable strings (Liquid, Handlebars, etc.) that are rendered
 * with the event's `data` payload at delivery time. One category can have multiple templates
 * (e.g., different wording for different audiences or A/B testing).
 */

/**
 * @typedef {Object} NotificationTemplateDocument
 * @property {string}        categoryId        - Reference to the owning notification_categories document. Cascade-delete when the category is deleted.
 * @property {string}        name              - Internal name (e.g., "Comment Created — Default", "Comment Created — Digest").
 * @property {string}        slug              - Identifier used in code (e.g., "comment_created_default"). Unique.
 * @property {string|null}   titleTemplate     - e.g., "New comment on {{issue_title}}"
 * @property {string|null}   bodyTemplate      - e.g., "{{actor_name}} commented: {{comment_body}}"
 * @property {string|null}   actionUrlTemplate - e.g., "{{app_url}}/issues/{{issue_id}}#comment-{{comment_id}}"
 * @property {boolean}       isActive          - Toggle a template without deleting it. Inactive templates are skipped during delivery.
 * @property {Timestamp}     createdAt
 * @property {Timestamp}     updatedAt
 */

/**
 * @param {Omit<NotificationTemplateDocument, "createdAt" | "updatedAt"> & Partial<Pick<NotificationTemplateDocument, "isActive">>} fields
 * @returns {Omit<NotificationTemplateDocument, "id">}
 */
export function createNotificationTemplate(fields) {
  return {
    categoryId:        fields.categoryId,
    name:              fields.name,
    slug:              fields.slug,
    titleTemplate:     fields.titleTemplate     ?? null,
    bodyTemplate:      fields.bodyTemplate      ?? null,
    actionUrlTemplate: fields.actionUrlTemplate ?? null,
    isActive:          fields.isActive          ?? true,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_templates").withConverter(notificationTemplateConverter)
 */
export const notificationTemplateConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      categoryId:        data.categoryId,
      name:              data.name,
      slug:              data.slug,
      titleTemplate:     data.titleTemplate     ?? null,
      bodyTemplate:      data.bodyTemplate      ?? null,
      actionUrlTemplate: data.actionUrlTemplate ?? null,
      isActive:          data.isActive          ?? true,
      createdAt:         data.createdAt,               // Timestamp
      updatedAt:         data.updatedAt,               // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_templates.categoryId  ASC  — "All templates for this category."
 *   - notification_templates.slug        ASC  — Fast lookup by slug (unique).
 */
