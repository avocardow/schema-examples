// campaigns: UTM campaign tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CampaignDocument
 * @property {string}      id
 * @property {string}      name
 * @property {string}      source
 * @property {string}      medium
 * @property {string|null} term
 * @property {string|null} content
 * @property {string|null} landingUrl
 * @property {boolean}     isActive
 * @property {string}      createdBy    - FK → users
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<CampaignDocument, "name" | "source" | "medium" | "createdBy"> & Partial<Pick<CampaignDocument, "term" | "content" | "landingUrl" | "isActive">>} fields
 * @returns {Omit<CampaignDocument, "id">}
 */
export function createCampaign(fields) {
  return {
    name:       fields.name,
    source:     fields.source,
    medium:     fields.medium,
    term:       fields.term       ?? null,
    content:    fields.content    ?? null,
    landingUrl: fields.landingUrl ?? null,
    isActive:   fields.isActive   ?? true,
    createdBy:  fields.createdBy,
    createdAt:  Timestamp.now(),
    updatedAt:  Timestamp.now(),
  };
}

export const campaignConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      name:       data.name,
      source:     data.source,
      medium:     data.medium,
      term:       data.term       ?? null,
      content:    data.content    ?? null,
      landingUrl: data.landingUrl ?? null,
      isActive:   data.isActive,
      createdBy:  data.createdBy,
      createdAt:  data.createdAt,
      updatedAt:  data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - campaigns.name      ASC
 *   - campaigns.source    ASC
 *   - campaigns.medium    ASC
 *   - campaigns.isActive  ASC
 *   - campaigns.createdBy ASC
 */
