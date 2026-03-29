// share_links: Shareable links for assets and collections with access controls.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ShareLinkDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string|null} assetId - FK → assets
 * @property {string|null} collectionId - FK → collections
 * @property {string} token
 * @property {string|null} passwordHash
 * @property {boolean} allowDownload
 * @property {import("firebase/firestore").Timestamp|null} expiresAt
 * @property {number} viewCount
 * @property {number|null} maxViews
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ShareLinkDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ShareLinkDocument, "id">}
 */
export function createShareLink(fields) {
  return {
    workspaceId:   fields.workspaceId,
    assetId:       fields.assetId ?? null,
    collectionId:  fields.collectionId ?? null,
    token:         fields.token,
    passwordHash:  fields.passwordHash ?? null,
    allowDownload: fields.allowDownload ?? true,
    expiresAt:     fields.expiresAt ?? null,
    viewCount:     fields.viewCount ?? 0,
    maxViews:      fields.maxViews ?? null,
    createdBy:     fields.createdBy,
    createdAt:     Timestamp.now(),
    updatedAt:     Timestamp.now(),
  };
}

export const shareLinkConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      workspaceId:   data.workspaceId,
      assetId:       data.assetId ?? null,
      collectionId:  data.collectionId ?? null,
      token:         data.token,
      passwordHash:  data.passwordHash ?? null,
      allowDownload: data.allowDownload,
      expiresAt:     data.expiresAt ?? null,
      viewCount:     data.viewCount,
      maxViews:      data.maxViews ?? null,
      createdBy:     data.createdBy,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "share_links"
 *   - token ASC
 *   - workspaceId ASC
 *   - assetId ASC
 *   - collectionId ASC
 */
