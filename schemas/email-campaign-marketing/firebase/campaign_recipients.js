// campaign_recipients: Links campaigns to target lists or segments.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CampaignRecipientDocument
 * @property {string} id
 * @property {string} campaignId - FK → campaigns
 * @property {string|null} listId - FK → contact_lists
 * @property {string|null} segmentId - FK → segments
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<CampaignRecipientDocument, "id" | "createdAt">} fields
 * @returns {Omit<CampaignRecipientDocument, "id">}
 */
export function createCampaignRecipient(fields) {
  return {
    campaignId: fields.campaignId,
    listId:     fields.listId    ?? null,
    segmentId:  fields.segmentId ?? null,
    createdAt:  Timestamp.now(),
  };
}

export const campaignRecipientConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      campaignId: data.campaignId,
      listId:     data.listId    ?? null,
      segmentId:  data.segmentId ?? null,
      createdAt:  data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - campaign_recipients.campaignId  ASC  — Find all recipient sources for a campaign.
 *   - campaign_recipients.listId      ASC  — Find campaigns targeting a specific list.
 *   - campaign_recipients.segmentId   ASC  — Find campaigns targeting a specific segment.
 */
