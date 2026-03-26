// audit_findings: issues discovered during audits with severity and remediation status.

import { Timestamp } from "firebase/firestore";

export const FINDING_SEVERITY = /** @type {const} */ ({
  CRITICAL:      "critical",
  HIGH:          "high",
  MEDIUM:        "medium",
  LOW:           "low",
  INFORMATIONAL: "informational",
});

export const FINDING_STATUS = /** @type {const} */ ({
  OPEN:        "open",
  IN_PROGRESS: "in_progress",
  REMEDIATED:  "remediated",
  ACCEPTED:    "accepted",
  CLOSED:      "closed",
});

/**
 * @typedef {Object} AuditFindingDocument
 * @property {string}      id
 * @property {string}      auditId   - FK → audits
 * @property {string|null} controlId - FK → controls
 * @property {string|null} riskId    - FK → risks
 * @property {string}      title
 * @property {string|null} description
 * @property {typeof FINDING_SEVERITY[keyof typeof FINDING_SEVERITY]} severity
 * @property {typeof FINDING_STATUS[keyof typeof FINDING_STATUS]}     status
 * @property {string|null} dueDate
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<AuditFindingDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<AuditFindingDocument, "id">}
 */
export function createAuditFinding(fields) {
  return {
    auditId:     fields.auditId,
    controlId:   fields.controlId   ?? null,
    riskId:      fields.riskId      ?? null,
    title:       fields.title,
    description: fields.description ?? null,
    severity:    fields.severity,
    status:      fields.status      ?? FINDING_STATUS.OPEN,
    dueDate:     fields.dueDate     ?? null,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const auditFindingConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      auditId:     data.auditId,
      controlId:   data.controlId   ?? null,
      riskId:      data.riskId      ?? null,
      title:       data.title,
      description: data.description ?? null,
      severity:    data.severity,
      status:      data.status,
      dueDate:     data.dueDate     ?? null,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "audit_findings"
 *   - auditId ASC, severity ASC
 *   - controlId ASC
 *   - riskId ASC
 *   - status ASC
 *   - severity ASC
 */
