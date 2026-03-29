// asset_activities: Audit log of all actions performed on assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ACTIVITY_ACTION = /** @type {const} */ ({
  UPLOADED:   "uploaded",
  UPDATED:    "updated",
  DOWNLOADED: "downloaded",
  SHARED:     "shared",
  COMMENTED:  "commented",
  TAGGED:     "tagged",
  MOVED:      "moved",
  VERSIONED:  "versioned",
  ARCHIVED:   "archived",
  RESTORED:   "restored",
  DELETED:    "deleted",
});

/**
 * @typedef {Object} AssetActivityDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string|null} assetId - FK → assets
 * @property {string} actorId - FK → users
 * @property {typeof ACTIVITY_ACTION[keyof typeof ACTIVITY_ACTION]} action
 * @property {Object|null} details
 * @property {import("firebase/firestore").Timestamp} occurredAt
 */

/**
 * @param {Omit<AssetActivityDocument, "id" | "occurredAt">} fields
 * @returns {Omit<AssetActivityDocument, "id">}
 */
export function createAssetActivity(fields) {
  return {
    workspaceId: fields.workspaceId,
    assetId:     fields.assetId ?? null,
    actorId:     fields.actorId,
    action:      fields.action,
    details:     fields.details ?? null,
    occurredAt:  Timestamp.now(),
  };
}

export const assetActivityConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      workspaceId: data.workspaceId,
      assetId:     data.assetId ?? null,
      actorId:     data.actorId,
      action:      data.action,
      details:     data.details ?? null,
      occurredAt:  data.occurredAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "asset_activities"
 *   - workspaceId ASC, occurredAt DESC
 *   - assetId ASC, occurredAt DESC
 *   - actorId ASC, occurredAt DESC
 *   - workspaceId ASC, action ASC, occurredAt DESC
 */
