// tenant_branding: Per-organization visual customization (logo, colors, CSS overrides).
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "tenant_branding"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - customCss can contain malicious payloads. Sanitize before rendering.
 *   - organizationId must be unique — enforce via transaction before writing.
 *   - Only org admins should be able to write branding documents.
 */

/**
 * @typedef {Object} TenantBrandingDocument
 * @property {string}      organizationId  - FK → organizations. One branding record per org.
 * @property {string|null} logoUrl         - Primary logo for light backgrounds.
 * @property {string|null} logoDarkUrl     - Logo variant for dark backgrounds.
 * @property {string|null} faviconUrl      - Browser tab icon.
 * @property {string|null} primaryColor    - Hex or CSS color value (e.g., "#4F46E5").
 * @property {string|null} accentColor     - Secondary brand color.
 * @property {string|null} backgroundColor - Page/app background color.
 * @property {string|null} customCss       - Arbitrary CSS overrides. Must be sanitized before use.
 * @property {string|null} supportEmail    - Tenant-facing support email address.
 * @property {string|null} supportUrl      - Link to tenant's help center or support page.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Omit<TenantBrandingDocument, "createdAt" | "updatedAt">} fields
 * @returns {Omit<TenantBrandingDocument, "id">}
 */
export function createTenantBranding(fields) {
  const now = Timestamp.now();
  return {
    organizationId:  fields.organizationId,
    logoUrl:         fields.logoUrl         ?? null,
    logoDarkUrl:     fields.logoDarkUrl     ?? null,
    faviconUrl:      fields.faviconUrl      ?? null,
    primaryColor:    fields.primaryColor    ?? null,
    accentColor:     fields.accentColor     ?? null,
    backgroundColor: fields.backgroundColor ?? null,
    customCss:       fields.customCss       ?? null,
    supportEmail:    fields.supportEmail    ?? null,
    supportUrl:      fields.supportUrl      ?? null,
    createdAt:       now,
    updatedAt:       now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("tenant_branding").withConverter(tenantBrandingConverter)
 */
export const tenantBrandingConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      organizationId:  data.organizationId,
      logoUrl:         data.logoUrl         ?? null,
      logoDarkUrl:     data.logoDarkUrl     ?? null,
      faviconUrl:      data.faviconUrl      ?? null,
      primaryColor:    data.primaryColor    ?? null,
      accentColor:     data.accentColor     ?? null,
      backgroundColor: data.backgroundColor ?? null,
      customCss:       data.customCss       ?? null,
      supportEmail:    data.supportEmail    ?? null,
      supportUrl:      data.supportUrl      ?? null,
      createdAt:       data.createdAt,               // Timestamp
      updatedAt:       data.updatedAt,               // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - tenant_branding.organizationId  ASC  — Must be unique; enforce via transaction before write.
 */
