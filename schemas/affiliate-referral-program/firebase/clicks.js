// clicks: Records each click on an affiliate link with device/geo metadata and uniqueness flag.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ClickDocument
 * @property {string}      id
 * @property {string}      affiliateLinkId - FK → affiliate_links (cascade delete)
 * @property {string}      clickId
 * @property {string|null} ipAddress
 * @property {string|null} userAgent
 * @property {string|null} refererUrl
 * @property {string|null} landingUrl
 * @property {string|null} country
 * @property {string|null} deviceType
 * @property {boolean}     isUnique
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Omit<ClickDocument, "id" | "createdAt">} data
 * @returns {Omit<ClickDocument, "id">}
 */
export function createClick(data) {
  return {
    affiliateLinkId: data.affiliateLinkId,
    clickId:         data.clickId,
    ipAddress:       data.ipAddress  ?? null,
    userAgent:       data.userAgent  ?? null,
    refererUrl:      data.refererUrl ?? null,
    landingUrl:      data.landingUrl ?? null,
    country:         data.country    ?? null,
    deviceType:      data.deviceType ?? null,
    isUnique:        data.isUnique   ?? true,
    createdAt:       Timestamp.now(),
  };
}

export const clickConverter = {
  toFirestore(click) {
    const { id, ...data } = click;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      affiliateLinkId: data.affiliateLinkId,
      clickId:         data.clickId,
      ipAddress:       data.ipAddress  ?? null,
      userAgent:       data.userAgent  ?? null,
      refererUrl:      data.refererUrl ?? null,
      landingUrl:      data.landingUrl ?? null,
      country:         data.country    ?? null,
      deviceType:      data.deviceType ?? null,
      isUnique:        data.isUnique,
      createdAt:       data.createdAt,
    };
  },
};

// Suggested Firestore indexes:
// - clicks: affiliateLinkId ASC, createdAt DESC
// - clicks: createdAt DESC
