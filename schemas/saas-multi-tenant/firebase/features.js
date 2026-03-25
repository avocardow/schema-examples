// features: Feature catalog with type taxonomy (boolean, limit, metered) and metadata.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "features"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - key must be unique — enforce via transaction before writing.
 *   - Restrict writes to admins only via Security Rules.
 *   - Deleting a feature that is referenced by plan_features must be blocked; check plan_features first.
 */

/**
 * @typedef {"boolean"|"limit"|"metered"} FeatureType
 */

export const FEATURE_TYPES = /** @type {const} */ ({
  BOOLEAN: "boolean",
  LIMIT:   "limit",
  METERED: "metered",
});

/**
 * @typedef {Object} FeatureDocument
 * @property {string}      key         - Unique machine-readable identifier (e.g., "sso", "api_rate_limit").
 * @property {string}      name        - Display name for admin UIs (e.g., "Single Sign-On", "API Rate Limit").
 * @property {string|null} description - Explain what this feature controls. Shown in plan management UI.
 * @property {FeatureType} featureType - Determines how plan_features interprets the value for this feature.
 * @property {string|null} unit        - Unit label for limit/metered features (e.g., "seats", "requests/mo").
 * @property {boolean}     isEnabled   - Global kill-switch. Disabled features are hidden from all plans.
 * @property {number}      sortOrder   - Controls display ordering in feature lists.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Omit<FeatureDocument, "isEnabled" | "sortOrder" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<FeatureDocument, "id">}
 */
export function createFeature(fields) {
  const now = Timestamp.now();
  return {
    key:         fields.key,
    name:        fields.name,
    description: fields.description ?? null,
    featureType: fields.featureType,
    unit:        fields.unit ?? null,
    isEnabled:   fields.isEnabled ?? true,
    sortOrder:   fields.sortOrder ?? 0,
    createdAt:   now,
    updatedAt:   now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("features").withConverter(featureConverter)
 */
export const featureConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      key:         data.key,
      name:        data.name,
      description: data.description ?? null,
      featureType: data.featureType,
      unit:        data.unit ?? null,
      isEnabled:   data.isEnabled ?? true,
      sortOrder:   data.sortOrder ?? 0,
      createdAt:   data.createdAt,              // Timestamp
      updatedAt:   data.updatedAt,              // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - features.key          ASC  — Must be unique; enforce via transaction before write.
 *   - features.featureType  ASC  — "List all metered features."
 *   - features.isEnabled    ASC  — "List all enabled features."
 */
