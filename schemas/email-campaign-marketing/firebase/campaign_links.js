// campaign_links: Tracked URLs embedded in campaign emails for click analytics.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CampaignLinkDocument
 * @property {string} id
 * @property {string} campaignId - FK → campaigns
 * @property {string} originalUrl
 * @property {number|null} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<CampaignLinkDocument, "id" | "createdAt">} fields
 * @returns {Omit<CampaignLinkDocument, "id">}
 */
export function createCampaignLink(fields) {
  return {
    campaignId:  fields.campaignId,
    originalUrl: fields.originalUrl,
    position:    fields.position ?? null,
    createdAt:   Timestamp.now(),
  };
}

export const campaignLinkConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      campaignId:  data.campaignId,
      originalUrl: data.originalUrl,
      position:    data.position ?? null,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - campaign_links (campaignId ASC, originalUrl ASC)  — Enforce uniqueness per campaign-URL pair.
 */
