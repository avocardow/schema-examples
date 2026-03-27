// campaign_sends: Individual email delivery records per contact per campaign.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CAMPAIGN_SEND_STATUS = /** @type {const} */ ({
  QUEUED: "queued",
  SENT: "sent",
  DELIVERED: "delivered",
  BOUNCED: "bounced",
  DROPPED: "dropped",
  DEFERRED: "deferred",
});

/**
 * @typedef {Object} CampaignSendDocument
 * @property {string} id
 * @property {string} campaignId - FK → campaigns
 * @property {string} contactId - FK → contacts
 * @property {typeof CAMPAIGN_SEND_STATUS[keyof typeof CAMPAIGN_SEND_STATUS]} status
 * @property {import("firebase/firestore").Timestamp|null} sentAt
 * @property {import("firebase/firestore").Timestamp|null} deliveredAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CampaignSendDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CampaignSendDocument, "id">}
 */
export function createCampaignSend(fields) {
  const now = Timestamp.now();
  return {
    campaignId:  fields.campaignId,
    contactId:   fields.contactId,
    status:      fields.status      ?? CAMPAIGN_SEND_STATUS.QUEUED,
    sentAt:      fields.sentAt      ?? null,
    deliveredAt: fields.deliveredAt ?? null,
    createdAt:   now,
    updatedAt:   now,
  };
}

export const campaignSendConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      campaignId:  data.campaignId,
      contactId:   data.contactId,
      status:      data.status,
      sentAt:      data.sentAt      ?? null,
      deliveredAt: data.deliveredAt ?? null,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - campaign_sends (campaignId ASC, contactId ASC)  — Enforce uniqueness per campaign-contact pair.
 *
 * Single-field:
 *   - campaign_sends.contactId  ASC  — Find all sends for a contact.
 *   - campaign_sends.status     ASC  — Filter sends by delivery status.
 *   - campaign_sends.sentAt     ASC  — Order sends by send time.
 */
