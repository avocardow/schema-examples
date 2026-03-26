// events: Core event records with scheduling, visibility, and registration settings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const EVENT_STATUSES = /** @type {const} */ ({
  DRAFT: "draft",
  PUBLISHED: "published",
  CANCELLED: "cancelled",
  POSTPONED: "postponed",
  COMPLETED: "completed",
});

export const EVENT_VISIBILITIES = /** @type {const} */ ({
  PUBLIC: "public",
  PRIVATE: "private",
  UNLISTED: "unlisted",
});

/**
 * @typedef {Object} EventDocument
 * @property {string} id
 * @property {string | null} seriesId - FK → event_series
 * @property {string | null} categoryId - FK → event_categories
 * @property {string | null} venueId - FK → venues
 * @property {string} title
 * @property {string} slug
 * @property {string | null} summary
 * @property {string | null} description
 * @property {string | null} coverImageUrl
 * @property {import("firebase/firestore").Timestamp} startTime
 * @property {import("firebase/firestore").Timestamp} endTime
 * @property {string} timezone
 * @property {boolean} isAllDay
 * @property {number | null} maxAttendees
 * @property {typeof EVENT_STATUSES[keyof typeof EVENT_STATUSES]} status
 * @property {typeof EVENT_VISIBILITIES[keyof typeof EVENT_VISIBILITIES]} visibility
 * @property {import("firebase/firestore").Timestamp | null} registrationOpenAt
 * @property {import("firebase/firestore").Timestamp | null} registrationCloseAt
 * @property {boolean} isFree
 * @property {string | null} contactEmail
 * @property {string | null} websiteUrl
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EventDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EventDocument, "id">}
 */
export function createEvent(fields) {
  return {
    seriesId: fields.seriesId ?? null,
    categoryId: fields.categoryId ?? null,
    venueId: fields.venueId ?? null,
    title: fields.title,
    slug: fields.slug,
    summary: fields.summary ?? null,
    description: fields.description ?? null,
    coverImageUrl: fields.coverImageUrl ?? null,
    startTime: fields.startTime,
    endTime: fields.endTime,
    timezone: fields.timezone,
    isAllDay: fields.isAllDay ?? false,
    maxAttendees: fields.maxAttendees ?? null,
    status: fields.status ?? EVENT_STATUSES.DRAFT,
    visibility: fields.visibility ?? EVENT_VISIBILITIES.PUBLIC,
    registrationOpenAt: fields.registrationOpenAt ?? null,
    registrationCloseAt: fields.registrationCloseAt ?? null,
    isFree: fields.isFree ?? false,
    contactEmail: fields.contactEmail ?? null,
    websiteUrl: fields.websiteUrl ?? null,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const eventConverter = {
  /** @param {Omit<EventDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      seriesId: data.seriesId ?? null,
      categoryId: data.categoryId ?? null,
      venueId: data.venueId ?? null,
      title: data.title,
      slug: data.slug,
      summary: data.summary ?? null,
      description: data.description ?? null,
      coverImageUrl: data.coverImageUrl ?? null,
      startTime: data.startTime,
      endTime: data.endTime,
      timezone: data.timezone,
      isAllDay: data.isAllDay,
      maxAttendees: data.maxAttendees ?? null,
      status: data.status,
      visibility: data.visibility,
      registrationOpenAt: data.registrationOpenAt ?? null,
      registrationCloseAt: data.registrationCloseAt ?? null,
      isFree: data.isFree,
      contactEmail: data.contactEmail ?? null,
      websiteUrl: data.websiteUrl ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "events"
 *   - status (ASC), startTime (ASC)
 *   - visibility (ASC), status (ASC), startTime (ASC)
 *   - categoryId (ASC), status (ASC), startTime (ASC)
 *   - seriesId (ASC), startTime (ASC)
 *   - venueId (ASC), startTime (ASC)
 *   - slug (ASC)
 *   - createdBy (ASC), createdAt (DESC)
 */
