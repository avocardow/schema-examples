// assets: Core table storing digital asset metadata and references.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ASSET_TYPE = /** @type {const} */ ({
  IMAGE:    "image",
  VIDEO:    "video",
  AUDIO:    "audio",
  DOCUMENT: "document",
  FONT:     "font",
  ARCHIVE:  "archive",
  OTHER:    "other",
});

export const ASSET_STATUS = /** @type {const} */ ({
  DRAFT:    "draft",
  ACTIVE:   "active",
  ARCHIVED: "archived",
  EXPIRED:  "expired",
});

/**
 * @typedef {Object} AssetDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string|null} folderId - FK → folders
 * @property {string} name
 * @property {string} originalFilename
 * @property {string|null} description
 * @property {string} storageKey
 * @property {string} mimeType
 * @property {number} fileSize
 * @property {string} fileExtension
 * @property {typeof ASSET_TYPE[keyof typeof ASSET_TYPE]} assetType
 * @property {typeof ASSET_STATUS[keyof typeof ASSET_STATUS]} status
 * @property {string|null} currentVersionId - FK → asset_versions
 * @property {number} versionCount
 * @property {number|null} width
 * @property {number|null} height
 * @property {number|null} durationSeconds
 * @property {string|null} colorSpace
 * @property {number|null} dpi
 * @property {string} uploadedBy - FK → users
 * @property {string|null} checksumSha256
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<AssetDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<AssetDocument, "id">}
 */
export function createAsset(fields) {
  return {
    workspaceId:      fields.workspaceId,
    folderId:         fields.folderId ?? null,
    name:             fields.name,
    originalFilename: fields.originalFilename,
    description:      fields.description ?? null,
    storageKey:       fields.storageKey,
    mimeType:         fields.mimeType,
    fileSize:         fields.fileSize,
    fileExtension:    fields.fileExtension,
    assetType:        fields.assetType,
    status:           fields.status ?? ASSET_STATUS.DRAFT,
    currentVersionId: fields.currentVersionId ?? null,
    versionCount:     fields.versionCount ?? 1,
    width:            fields.width ?? null,
    height:           fields.height ?? null,
    durationSeconds:  fields.durationSeconds ?? null,
    colorSpace:       fields.colorSpace ?? null,
    dpi:              fields.dpi ?? null,
    uploadedBy:       fields.uploadedBy,
    checksumSha256:   fields.checksumSha256 ?? null,
    createdAt:        Timestamp.now(),
    updatedAt:        Timestamp.now(),
  };
}

export const assetConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      workspaceId:      data.workspaceId,
      folderId:         data.folderId ?? null,
      name:             data.name,
      originalFilename: data.originalFilename,
      description:      data.description ?? null,
      storageKey:       data.storageKey,
      mimeType:         data.mimeType,
      fileSize:         data.fileSize,
      fileExtension:    data.fileExtension,
      assetType:        data.assetType,
      status:           data.status,
      currentVersionId: data.currentVersionId ?? null,
      versionCount:     data.versionCount,
      width:            data.width ?? null,
      height:           data.height ?? null,
      durationSeconds:  data.durationSeconds ?? null,
      colorSpace:       data.colorSpace ?? null,
      dpi:              data.dpi ?? null,
      uploadedBy:       data.uploadedBy,
      checksumSha256:   data.checksumSha256 ?? null,
      createdAt:        data.createdAt,
      updatedAt:        data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "assets"
 *   - workspaceId ASC, status ASC
 *   - workspaceId ASC, folderId ASC
 *   - workspaceId ASC, assetType ASC
 *   - storageKey ASC
 *   - uploadedBy ASC
 */
