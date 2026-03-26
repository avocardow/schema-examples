// frameworks: compliance frameworks (e.g., SOC 2, ISO 27001) adopted by organizations.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FrameworkDocument
 * @property {string}      id
 * @property {string|null} organizationId - FK → organizations
 * @property {string}      name
 * @property {string|null} version
 * @property {string|null} authority
 * @property {string|null} description
 * @property {string|null} websiteUrl
 * @property {boolean}     isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<FrameworkDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<FrameworkDocument, "id">}
 */
export function createFramework(fields) {
  return {
    organizationId: fields.organizationId ?? null,
    name:           fields.name,
    version:        fields.version        ?? null,
    authority:      fields.authority      ?? null,
    description:    fields.description    ?? null,
    websiteUrl:     fields.websiteUrl     ?? null,
    isActive:       fields.isActive       ?? true,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

export const frameworkConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId ?? null,
      name:           data.name,
      version:        data.version        ?? null,
      authority:      data.authority      ?? null,
      description:    data.description    ?? null,
      websiteUrl:     data.websiteUrl     ?? null,
      isActive:       data.isActive,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "frameworks"
 *   - organizationId ASC, createdAt DESC
 *   - isActive ASC
 */
