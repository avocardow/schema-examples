// speakers: Speaker profiles for event sessions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SpeakerDocument
 * @property {string} id
 * @property {string | null} userId - FK → users
 * @property {string} name
 * @property {string | null} email
 * @property {string | null} bio
 * @property {string | null} title
 * @property {string | null} company
 * @property {string | null} avatarUrl
 * @property {string | null} websiteUrl
 * @property {string | null} twitterHandle
 * @property {string | null} linkedinUrl
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<SpeakerDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<SpeakerDocument, "id">}
 */
export function createSpeaker(fields) {
  return {
    userId: fields.userId ?? null,
    name: fields.name,
    email: fields.email ?? null,
    bio: fields.bio ?? null,
    title: fields.title ?? null,
    company: fields.company ?? null,
    avatarUrl: fields.avatarUrl ?? null,
    websiteUrl: fields.websiteUrl ?? null,
    twitterHandle: fields.twitterHandle ?? null,
    linkedinUrl: fields.linkedinUrl ?? null,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const speakerConverter = {
  /** @param {Omit<SpeakerDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId ?? null,
      name: data.name,
      email: data.email ?? null,
      bio: data.bio ?? null,
      title: data.title ?? null,
      company: data.company ?? null,
      avatarUrl: data.avatarUrl ?? null,
      websiteUrl: data.websiteUrl ?? null,
      twitterHandle: data.twitterHandle ?? null,
      linkedinUrl: data.linkedinUrl ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "speakers"
 *   - userId (ASC)
 *   - isActive (ASC), name (ASC)
 */
