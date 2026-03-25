// provider_webhook_events: incoming webhook payloads from payment providers for idempotent processing.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProviderWebhookEventDocument
 * @property {string} id
 * @property {string} providerType
 * @property {string} providerEventId
 * @property {string} eventType
 * @property {Object} payload
 * @property {import("firebase/firestore").Timestamp | null} processedAt
 * @property {string | null} processingError
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ProviderWebhookEventDocument, "id" | "createdAt">} fields
 * @returns {Omit<ProviderWebhookEventDocument, "id">}
 */
export function createProviderWebhookEvent(fields) {
  return {
    providerType: fields.providerType,
    providerEventId: fields.providerEventId,
    eventType: fields.eventType,
    payload: fields.payload,
    processedAt: fields.processedAt ?? null,
    processingError: fields.processingError ?? null,
    createdAt: Timestamp.now(),
  };
}

export const providerWebhookEventConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      providerType: data.providerType,
      providerEventId: data.providerEventId,
      eventType: data.eventType,
      payload: data.payload,
      processedAt: data.processedAt ?? null,
      processingError: data.processingError ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "provider_webhook_events"
 *   - providerType ASC, providerEventId ASC (unique)
 *   - providerType ASC, eventType ASC, createdAt DESC
 *   - processedAt ASC, createdAt ASC
 */
