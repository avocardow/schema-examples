// custom_domains: Custom domain mapping for white-label routing with DNS verification and SSL status.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VERIFICATION_METHODS = /** @type {const} */ ({
  CNAME: "cname",
  TXT: "txt",
});

export const SSL_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  ACTIVE: "active",
  FAILED: "failed",
  EXPIRED: "expired",
});

/**
 * Collection: "custom_domains"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - domain must be globally unique — enforce via transaction before write.
 *   - Only verified domains (isVerified=true) should serve traffic.
 *   - verificationToken is the secret value the org places in DNS.
 *     Consider clearing it after verification succeeds to limit exposure.
 *   - sslExpiresAt should be monitored; auto-renew or alert before expiry.
 */

/**
 * @typedef {Object} CustomDomainDocument
 * @property {string}         id
 * @property {string}         organizationId       - FK → organizations
 * @property {string}         domain               - e.g., "app.acme.com". Must be globally unique.
 * @property {typeof VERIFICATION_METHODS[keyof typeof VERIFICATION_METHODS]} verificationMethod
 * @property {string}         verificationToken    - DNS token the org must set to prove ownership.
 * @property {boolean}        isVerified
 * @property {import("firebase/firestore").Timestamp | null} verifiedAt
 * @property {typeof SSL_STATUSES[keyof typeof SSL_STATUSES]} sslStatus
 * @property {import("firebase/firestore").Timestamp | null} sslExpiresAt
 * @property {boolean}        isPrimary
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CustomDomainDocument, "id" | "isVerified" | "verifiedAt" | "sslStatus" | "sslExpiresAt" | "isPrimary" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CustomDomainDocument, "id">}
 */
export function createCustomDomain(fields) {
  const now = Timestamp.now();
  return {
    organizationId:   fields.organizationId,
    domain:           fields.domain,
    verificationMethod: fields.verificationMethod ?? VERIFICATION_METHODS.CNAME,
    verificationToken:  fields.verificationToken,
    isVerified:       false,
    verifiedAt:       null,
    sslStatus:        SSL_STATUSES.PENDING,
    sslExpiresAt:     null,
    isPrimary:        false,
    createdAt:        now,
    updatedAt:        now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("custom_domains").withConverter(customDomainConverter)
 */
export const customDomainConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      organizationId:     data.organizationId,
      domain:             data.domain,
      verificationMethod: data.verificationMethod ?? VERIFICATION_METHODS.CNAME,
      verificationToken:  data.verificationToken,
      isVerified:         data.isVerified         ?? false,
      verifiedAt:         data.verifiedAt         ?? null,  // Timestamp | null
      sslStatus:          data.sslStatus          ?? SSL_STATUSES.PENDING,
      sslExpiresAt:       data.sslExpiresAt       ?? null,  // Timestamp | null
      isPrimary:          data.isPrimary           ?? false,
      createdAt:          data.createdAt,                    // Timestamp
      updatedAt:          data.updatedAt,                    // Timestamp
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "custom_domains"
 *   - organizationId ASC, createdAt DESC
 *   - domain ASC  — Must be unique; enforce via transaction before write.
 */
