// sessions: User sessions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SessionDocument
 * @property {string}         id
 * @property {string|null}    userId       - FK → users
 * @property {string|null}    anonymousId
 * @property {Timestamp}      startedAt
 * @property {Timestamp|null} endedAt
 * @property {number|null}    duration
 * @property {number}         pageCount
 * @property {number}         eventCount
 * @property {boolean}        isBounce
 * @property {string|null}    entryUrl
 * @property {string|null}    exitUrl
 * @property {string|null}    ipAddress
 * @property {string|null}    userAgent
 * @property {string|null}    deviceType
 * @property {string|null}    os
 * @property {string|null}    browser
 * @property {string|null}    country
 * @property {string|null}    region
 * @property {string|null}    city
 * @property {string|null}    locale
 * @property {string|null}    referrer
 * @property {string|null}    campaignId   - FK → campaigns
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Pick<SessionDocument, "startedAt"> & Partial<Pick<SessionDocument, "userId" | "anonymousId" | "endedAt" | "duration" | "pageCount" | "eventCount" | "isBounce" | "entryUrl" | "exitUrl" | "ipAddress" | "userAgent" | "deviceType" | "os" | "browser" | "country" | "region" | "city" | "locale" | "referrer" | "campaignId">>} fields
 * @returns {Omit<SessionDocument, "id">}
 */
export function createSession(fields) {
  return {
    userId:      fields.userId      ?? null,
    anonymousId: fields.anonymousId ?? null,
    startedAt:   fields.startedAt,
    endedAt:     fields.endedAt     ?? null,
    duration:    fields.duration    ?? null,
    pageCount:   fields.pageCount   ?? 0,
    eventCount:  fields.eventCount  ?? 0,
    isBounce:    fields.isBounce    ?? true,
    entryUrl:    fields.entryUrl    ?? null,
    exitUrl:     fields.exitUrl     ?? null,
    ipAddress:   fields.ipAddress   ?? null,
    userAgent:   fields.userAgent   ?? null,
    deviceType:  fields.deviceType  ?? null,
    os:          fields.os          ?? null,
    browser:     fields.browser     ?? null,
    country:     fields.country     ?? null,
    region:      fields.region      ?? null,
    city:        fields.city        ?? null,
    locale:      fields.locale      ?? null,
    referrer:    fields.referrer    ?? null,
    campaignId:  fields.campaignId  ?? null,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const sessionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      userId:      data.userId      ?? null,
      anonymousId: data.anonymousId ?? null,
      startedAt:   data.startedAt,
      endedAt:     data.endedAt     ?? null,
      duration:    data.duration    ?? null,
      pageCount:   data.pageCount,
      eventCount:  data.eventCount,
      isBounce:    data.isBounce,
      entryUrl:    data.entryUrl    ?? null,
      exitUrl:     data.exitUrl     ?? null,
      ipAddress:   data.ipAddress   ?? null,
      userAgent:   data.userAgent   ?? null,
      deviceType:  data.deviceType  ?? null,
      os:          data.os          ?? null,
      browser:     data.browser     ?? null,
      country:     data.country     ?? null,
      region:      data.region      ?? null,
      city:        data.city        ?? null,
      locale:      data.locale      ?? null,
      referrer:    data.referrer    ?? null,
      campaignId:  data.campaignId  ?? null,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - sessions.userId      ASC
 *   - sessions.anonymousId ASC
 *   - sessions.startedAt   DESC
 *   - sessions.campaignId  ASC
 *
 * Composite:
 *   - sessions.userId ASC, sessions.startedAt DESC
 *   - sessions.isBounce ASC, sessions.startedAt DESC
 */
