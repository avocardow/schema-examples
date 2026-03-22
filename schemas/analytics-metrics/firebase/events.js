// events: Append-only event log.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} EventDocument
 * @property {string}      id
 * @property {string}      eventTypeId  - FK → event_types
 * @property {string|null} userId       - FK → users
 * @property {string|null} anonymousId
 * @property {string|null} sessionId    - FK → sessions
 * @property {Timestamp}   timestamp
 * @property {string|null} ipAddress
 * @property {string|null} userAgent
 * @property {string|null} deviceType
 * @property {string|null} os
 * @property {string|null} browser
 * @property {string|null} country
 * @property {string|null} region
 * @property {string|null} city
 * @property {string|null} locale
 * @property {string|null} referrer
 * @property {string|null} campaignId   - FK → campaigns
 * @property {Object|null} properties
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<EventDocument, "eventTypeId" | "timestamp"> & Partial<Pick<EventDocument, "userId" | "anonymousId" | "sessionId" | "ipAddress" | "userAgent" | "deviceType" | "os" | "browser" | "country" | "region" | "city" | "locale" | "referrer" | "campaignId" | "properties">>} fields
 * @returns {Omit<EventDocument, "id">}
 */
export function createEvent(fields) {
  return {
    eventTypeId: fields.eventTypeId,
    userId:      fields.userId      ?? null,
    anonymousId: fields.anonymousId ?? null,
    sessionId:   fields.sessionId   ?? null,
    timestamp:   fields.timestamp,
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
    properties:  fields.properties  ?? null,
    createdAt:   Timestamp.now(),
  };
}

export const eventConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      eventTypeId: data.eventTypeId,
      userId:      data.userId      ?? null,
      anonymousId: data.anonymousId ?? null,
      sessionId:   data.sessionId   ?? null,
      timestamp:   data.timestamp,
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
      properties:  data.properties  ?? null,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - events.eventTypeId  ASC
 *   - events.userId       ASC
 *   - events.anonymousId  ASC
 *   - events.sessionId    ASC
 *   - events.timestamp    DESC
 *   - events.campaignId   ASC
 *
 * Composite:
 *   - events.eventTypeId ASC, events.timestamp DESC
 *   - events.userId ASC, events.timestamp DESC
 */
