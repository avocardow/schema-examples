// finding_remediations: remediation tasks assigned to resolve audit findings.

import { Timestamp } from "firebase/firestore";

export const REMEDIATION_STATUS = /** @type {const} */ ({
  PENDING:     "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED:   "completed",
  CANCELLED:   "cancelled",
});

export const REMEDIATION_PRIORITY = /** @type {const} */ ({
  CRITICAL: "critical",
  HIGH:     "high",
  MEDIUM:   "medium",
  LOW:      "low",
});

/**
 * @typedef {Object} FindingRemediationDocument
 * @property {string}      id
 * @property {string}      findingId   - FK → audit_findings
 * @property {string|null} assignedTo  - FK → users
 * @property {string}      title
 * @property {string|null} description
 * @property {typeof REMEDIATION_STATUS[keyof typeof REMEDIATION_STATUS]}     status
 * @property {typeof REMEDIATION_PRIORITY[keyof typeof REMEDIATION_PRIORITY]} priority
 * @property {string|null} dueDate
 * @property {import("firebase/firestore").Timestamp|null} completedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<FindingRemediationDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<FindingRemediationDocument, "id">}
 */
export function createFindingRemediation(fields) {
  return {
    findingId:   fields.findingId,
    assignedTo:  fields.assignedTo  ?? null,
    title:       fields.title,
    description: fields.description ?? null,
    status:      fields.status      ?? REMEDIATION_STATUS.PENDING,
    priority:    fields.priority    ?? REMEDIATION_PRIORITY.MEDIUM,
    dueDate:     fields.dueDate     ?? null,
    completedAt: fields.completedAt ?? null,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const findingRemediationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      findingId:   data.findingId,
      assignedTo:  data.assignedTo  ?? null,
      title:       data.title,
      description: data.description ?? null,
      status:      data.status,
      priority:    data.priority,
      dueDate:     data.dueDate     ?? null,
      completedAt: data.completedAt ?? null,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "finding_remediations"
 *   - findingId ASC, status ASC
 *   - assignedTo ASC
 *   - status ASC
 *   - priority ASC
 *   - dueDate ASC
 */
