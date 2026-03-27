// campaign_events: Engagement events (opens, clicks, bounces) for campaign sends.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CAMPAIGN_EVENT_TYPE = /** @type {const} */ ({
  OPEN: "open",
  CLICK: "click",
  BOUNCE: "bounce",
  COMPLAINT: "complaint",
  UNSUBSCRIBE: "unsubscribe",
});

/**
 * @typedef {Object} CampaignEventDocument
 * @property {string} id
 * @property {string} sendId - FK → campaign_sends
 * @property {typeof CAMPAIGN_EVENT_TYPE[keyof typeof CAMPAIGN_EVENT_TYPE]} eventType
 * @property {string|null} linkId - FK → campaign_links
 * @property {Object|null} metadata
 * @property {import("firebase/firestore").Timestamp} occurredAt
 */

/**
 * @param {Omit<CampaignEventDocument, "id" | "occurredAt">} fields
 * @returns {Omit<CampaignEventDocument, "id">}
 */
export function createCampaignEvent(fields) {
  return {
    sendId:     fields.sendId,
    eventType:  fields.eventType,
    linkId:     fields.linkId   ?? null,
    metadata:   fields.metadata ?? null,
    occurredAt: Timestamp.now(),
  };
}

export const campaignEventConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      sendId:     data.sendId,
      eventType:  data.eventType,
      linkId:     data.linkId   ?? null,
      metadata:   data.metadata ?? null,
      occurredAt: data.occurredAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - campaign_events.sendId      ASC  — Find all events for a specific send.
 *   - campaign_events.eventType   ASC  — Filter events by type.
 *   - campaign_events.occurredAt  ASC  — Order events chronologically.
 */
