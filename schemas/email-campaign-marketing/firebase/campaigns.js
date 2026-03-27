// campaigns: Email campaigns with scheduling, A/B testing, and delivery tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CAMPAIGN_STATUS = /** @type {const} */ ({
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  SENDING: "sending",
  PAUSED: "paused",
  CANCELLED: "cancelled",
  SENT: "sent",
});

export const CAMPAIGN_TYPE = /** @type {const} */ ({
  REGULAR: "regular",
  AB_TEST: "ab_test",
});

export const AB_TEST_METRIC = /** @type {const} */ ({
  OPEN_RATE: "open_rate",
  CLICK_RATE: "click_rate",
});

/**
 * @typedef {Object} CampaignDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} subject
 * @property {string|null} fromName
 * @property {string|null} fromEmail
 * @property {string|null} replyTo
 * @property {string|null} templateId - FK → templates
 * @property {string|null} htmlBody
 * @property {string|null} textBody
 * @property {typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS]} status
 * @property {typeof CAMPAIGN_TYPE[keyof typeof CAMPAIGN_TYPE]} campaignType
 * @property {import("firebase/firestore").Timestamp|null} scheduledAt
 * @property {import("firebase/firestore").Timestamp|null} sentAt
 * @property {string|null} abTestWinnerId
 * @property {number|null} abTestSamplePct
 * @property {typeof AB_TEST_METRIC[keyof typeof AB_TEST_METRIC]|null} abTestMetric
 * @property {string|null} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CampaignDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CampaignDocument, "id">}
 */
export function createCampaign(fields) {
  const now = Timestamp.now();
  return {
    name:             fields.name,
    subject:          fields.subject          ?? null,
    fromName:         fields.fromName         ?? null,
    fromEmail:        fields.fromEmail        ?? null,
    replyTo:          fields.replyTo          ?? null,
    templateId:       fields.templateId       ?? null,
    htmlBody:         fields.htmlBody         ?? null,
    textBody:         fields.textBody         ?? null,
    status:           fields.status           ?? CAMPAIGN_STATUS.DRAFT,
    campaignType:     fields.campaignType     ?? CAMPAIGN_TYPE.REGULAR,
    scheduledAt:      fields.scheduledAt      ?? null,
    sentAt:           fields.sentAt           ?? null,
    abTestWinnerId:   fields.abTestWinnerId   ?? null,
    abTestSamplePct:  fields.abTestSamplePct  ?? null,
    abTestMetric:     fields.abTestMetric     ?? null,
    createdBy:        fields.createdBy        ?? null,
    createdAt:        now,
    updatedAt:        now,
  };
}

export const campaignConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      name:             data.name,
      subject:          data.subject          ?? null,
      fromName:         data.fromName         ?? null,
      fromEmail:        data.fromEmail        ?? null,
      replyTo:          data.replyTo          ?? null,
      templateId:       data.templateId       ?? null,
      htmlBody:         data.htmlBody         ?? null,
      textBody:         data.textBody         ?? null,
      status:           data.status,
      campaignType:     data.campaignType,
      scheduledAt:      data.scheduledAt      ?? null,
      sentAt:           data.sentAt           ?? null,
      abTestWinnerId:   data.abTestWinnerId   ?? null,
      abTestSamplePct:  data.abTestSamplePct  ?? null,
      abTestMetric:     data.abTestMetric     ?? null,
      createdBy:        data.createdBy        ?? null,
      createdAt:        data.createdAt,
      updatedAt:        data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - campaigns.status       ASC  — Filter campaigns by delivery status.
 *   - campaigns.campaignType ASC  — Filter by campaign type (regular vs A/B).
 *   - campaigns.templateId   ASC  — Find campaigns using a specific template.
 *   - campaigns.scheduledAt  ASC  — Order campaigns by scheduled send time.
 *   - campaigns.createdAt    ASC  — Sort campaigns by creation date.
 */
