// tenant_settings: Per-organization key-value configuration settings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TenantSettingDocument
 * @property {string} id
 * @property {string} organizationId - FK → organizations
 * @property {string} key
 * @property {string} value
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/** @param {Omit<TenantSettingDocument, "id" | "createdAt" | "updatedAt">} fields @returns {Omit<TenantSettingDocument, "id">} */
export function createTenantSetting(fields) {
  const now = Timestamp.now();
  return {
    organizationId: fields.organizationId,
    key:            fields.key,
    value:          fields.value,
    createdAt:      now,
    updatedAt:      now,
  };
}

export const tenantSettingConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId,
      key:            data.key,
      value:          data.value,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - tenant_settings (organizationId ASC, key ASC) UNIQUE — Enforce via transaction before write.
 */
