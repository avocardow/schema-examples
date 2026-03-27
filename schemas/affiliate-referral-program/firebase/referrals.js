// referrals: Tracks visitor-to-lead-to-conversion journey for each affiliate.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const REFERRAL_STATUS = /** @type {const} */ ({
  VISIT: "visit",
  LEAD: "lead",
  CONVERTED: "converted",
  EXPIRED: "expired",
});

/**
 * @typedef {Object} ReferralDocument
 * @property {string} id
 * @property {string} affiliateId - FK → affiliates
 * @property {string|null} clickId - FK → clicks
 * @property {string|null} visitorId
 * @property {string|null} email
 * @property {typeof REFERRAL_STATUS[keyof typeof REFERRAL_STATUS]} status
 * @property {string|null} landingUrl
 * @property {Object|null} metadata
 * @property {Timestamp|null} convertedAt
 * @property {Timestamp|null} expiresAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<ReferralDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<ReferralDocument, "id">}
 */
export function createReferral(data) {
  return {
    affiliateId: data.affiliateId,
    clickId: data.clickId ?? null,
    visitorId: data.visitorId ?? null,
    email: data.email ?? null,
    status: data.status ?? REFERRAL_STATUS.VISIT,
    landingUrl: data.landingUrl ?? null,
    metadata: data.metadata ?? null,
    convertedAt: data.convertedAt ?? null,
    expiresAt: data.expiresAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const referralConverter = {
  toFirestore(referral) {
    const { id, ...data } = referral;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      affiliateId: data.affiliateId,
      clickId: data.clickId ?? null,
      visitorId: data.visitorId ?? null,
      email: data.email ?? null,
      status: data.status,
      landingUrl: data.landingUrl ?? null,
      metadata: data.metadata ?? null,
      convertedAt: data.convertedAt ?? null,
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - referrals: affiliateId ASC, status ASC
// - referrals: status ASC
// - referrals: email ASC
// - referrals: visitorId ASC
