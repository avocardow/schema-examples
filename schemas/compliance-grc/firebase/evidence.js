// evidence: compliance evidence collected for controls and audits.

import { Timestamp } from "firebase/firestore";

export const EVIDENCE_TYPE = /** @type {const} */ ({
  DOCUMENT:       "document",
  SCREENSHOT:     "screenshot",
  LOG_EXPORT:     "log_export",
  AUTOMATED_TEST: "automated_test",
  MANUAL_REVIEW:  "manual_review",
  CERTIFICATION:  "certification",
});

/**
 * @typedef {Object} EvidenceDocument
 * @property {string}      id
 * @property {string}      controlId   - FK → controls
 * @property {string|null} auditId     - FK → audits
 * @property {string|null} fileId      - FK → files
 * @property {string|null} collectedBy - FK → users
 * @property {string}      title
 * @property {typeof EVIDENCE_TYPE[keyof typeof EVIDENCE_TYPE]} evidenceType
 * @property {string|null} description
 * @property {import("firebase/firestore").Timestamp} collectedAt
 * @property {string|null} validFrom
 * @property {string|null} validUntil
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<EvidenceDocument, "id" | "createdAt">} fields
 * @returns {Omit<EvidenceDocument, "id">}
 */
export function createEvidence(fields) {
  return {
    controlId:   fields.controlId,
    auditId:     fields.auditId     ?? null,
    fileId:      fields.fileId      ?? null,
    collectedBy: fields.collectedBy ?? null,
    title:       fields.title,
    evidenceType: fields.evidenceType,
    description: fields.description ?? null,
    collectedAt: fields.collectedAt,
    validFrom:   fields.validFrom   ?? null,
    validUntil:  fields.validUntil  ?? null,
    createdAt:   Timestamp.now(),
  };
}

export const evidenceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      controlId:    data.controlId,
      auditId:      data.auditId     ?? null,
      fileId:       data.fileId      ?? null,
      collectedBy:  data.collectedBy ?? null,
      title:        data.title,
      evidenceType: data.evidenceType,
      description:  data.description ?? null,
      collectedAt:  data.collectedAt,
      validFrom:    data.validFrom   ?? null,
      validUntil:   data.validUntil  ?? null,
      createdAt:    data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "evidence"
 *   - controlId ASC, collectedAt DESC
 *   - auditId ASC
 *   - collectedBy ASC
 *   - evidenceType ASC
 *   - collectedAt DESC
 */
