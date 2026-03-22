// notification_template_contents: Per-channel content variants for a template.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_template_contents"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each channel gets its own content definition with channel-specific metadata.
 * SMS needs short text (160 chars), email needs a subject line and rich HTML,
 * push needs a title and a short body, in-app needs structured blocks.
 *
 * Enforce unique(templateId, channelType) in security rules or application logic.
 */

/**
 * @typedef {"email"|"sms"|"push"|"in_app"|"chat"|"webhook"} ChannelType
 */

export const CHANNEL_TYPES = /** @type {const} */ ({
  EMAIL:   "email",
  SMS:     "sms",
  PUSH:    "push",
  IN_APP:  "in_app",
  CHAT:    "chat",
  WEBHOOK: "webhook",
});

/**
 * @typedef {Object} NotificationTemplateContentDocument
 * @property {string}        templateId   - Reference to the owning notification_templates document. Cascade-delete when the template is deleted.
 * @property {ChannelType}   channelType  - Which channel this content is for.
 * @property {string|null}   subject      - Email subject, push title. Not applicable for SMS or webhook.
 * @property {string}        body         - The main content. HTML for email, plain text for SMS, structured for in-app.
 * @property {Object|null}   metadata     - Channel-specific metadata as JSON. Email: { preheader, reply_to, from_name }. Push: { icon, sound, badge_count, image_url }. In-app: { blocks, cta }. SMS: { sender_id }. Webhook: { method, headers }.
 * @property {Timestamp}     createdAt
 * @property {Timestamp}     updatedAt
 */

/**
 * @param {Omit<NotificationTemplateContentDocument, "metadata" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<NotificationTemplateContentDocument, "id">}
 */
export function createNotificationTemplateContent(fields) {
  return {
    templateId:  fields.templateId,
    channelType: fields.channelType,
    subject:     fields.subject  ?? null,
    body:        fields.body,
    metadata:    fields.metadata ?? {},
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_template_contents").withConverter(notificationTemplateContentConverter)
 */
export const notificationTemplateContentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      templateId:  data.templateId,
      channelType: data.channelType,
      subject:     data.subject  ?? null,
      body:        data.body,
      metadata:    data.metadata ?? {},
      createdAt:   data.createdAt,               // Timestamp
      updatedAt:   data.updatedAt,               // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_template_contents.templateId  ASC  — "All channel variants for this template."
 *
 * Composite:
 *   - notification_template_contents(templateId ASC, channelType ASC)  — Unique constraint: one content variant per channel per template.
 */
