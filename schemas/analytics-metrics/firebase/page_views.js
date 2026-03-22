// page_views: Page view tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PageViewDocument
 * @property {string}      id
 * @property {string|null} eventId      - FK → events
 * @property {string|null} userId       - FK → users
 * @property {string|null} anonymousId
 * @property {string|null} sessionId    - FK → sessions
 * @property {string}      url
 * @property {string}      path
 * @property {string|null} title
 * @property {string|null} referrer
 * @property {string}      hostname
 * @property {number|null} viewportWidth
 * @property {number|null} viewportHeight
 * @property {number|null} screenWidth
 * @property {number|null} screenHeight
 * @property {number|null} duration
 * @property {Timestamp}   timestamp
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<PageViewDocument, "url" | "path" | "hostname" | "timestamp"> & Partial<Pick<PageViewDocument, "eventId" | "userId" | "anonymousId" | "sessionId" | "title" | "referrer" | "viewportWidth" | "viewportHeight" | "screenWidth" | "screenHeight" | "duration">>} fields
 * @returns {Omit<PageViewDocument, "id">}
 */
export function createPageView(fields) {
  return {
    eventId:        fields.eventId        ?? null,
    userId:         fields.userId         ?? null,
    anonymousId:    fields.anonymousId    ?? null,
    sessionId:      fields.sessionId      ?? null,
    url:            fields.url,
    path:           fields.path,
    title:          fields.title          ?? null,
    referrer:       fields.referrer       ?? null,
    hostname:       fields.hostname,
    viewportWidth:  fields.viewportWidth  ?? null,
    viewportHeight: fields.viewportHeight ?? null,
    screenWidth:    fields.screenWidth    ?? null,
    screenHeight:   fields.screenHeight   ?? null,
    duration:       fields.duration       ?? null,
    timestamp:      fields.timestamp,
    createdAt:      Timestamp.now(),
  };
}

export const pageViewConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      eventId:        data.eventId        ?? null,
      userId:         data.userId         ?? null,
      anonymousId:    data.anonymousId    ?? null,
      sessionId:      data.sessionId      ?? null,
      url:            data.url,
      path:           data.path,
      title:          data.title          ?? null,
      referrer:       data.referrer       ?? null,
      hostname:       data.hostname,
      viewportWidth:  data.viewportWidth  ?? null,
      viewportHeight: data.viewportHeight ?? null,
      screenWidth:    data.screenWidth    ?? null,
      screenHeight:   data.screenHeight   ?? null,
      duration:       data.duration       ?? null,
      timestamp:      data.timestamp,
      createdAt:      data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - page_views.userId      ASC
 *   - page_views.anonymousId ASC
 *   - page_views.sessionId   ASC
 *   - page_views.path        ASC
 *   - page_views.hostname    ASC
 *   - page_views.timestamp   DESC
 *
 * Composite:
 *   - page_views.userId ASC, page_views.timestamp DESC
 *   - page_views.path ASC, page_views.timestamp DESC
 */
