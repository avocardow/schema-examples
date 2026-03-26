// audits: compliance audits with type, scope, and lifecycle tracking.

import { Timestamp } from "firebase/firestore";

export const AUDIT_TYPE = /** @type {const} */ ({
  INTERNAL:        "internal",
  EXTERNAL:        "external",
  SELF_ASSESSMENT: "self_assessment",
  CERTIFICATION:   "certification",
});

export const AUDIT_STATUS = /** @type {const} */ ({
  PLANNED:     "planned",
  IN_PROGRESS: "in_progress",
  REVIEW:      "review",
  COMPLETED:   "completed",
  CANCELLED:   "cancelled",
});

/**
 * @typedef {Object} AuditDocument
 * @property {string}      id
 * @property {string|null} organizationId - FK → organizations
 * @property {string|null} leadAuditorId  - FK → users
 * @property {string}      title
 * @property {typeof AUDIT_TYPE[keyof typeof AUDIT_TYPE]}     auditType
 * @property {typeof AUDIT_STATUS[keyof typeof AUDIT_STATUS]} status
 * @property {string|null} scope
 * @property {string|null} startDate
 * @property {string|null} endDate
 * @property {string|null} conclusion
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<AuditDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<AuditDocument, "id">}
 */
export function createAudit(fields) {
  return {
    organizationId: fields.organizationId ?? null,
    leadAuditorId:  fields.leadAuditorId  ?? null,
    title:          fields.title,
    auditType:      fields.auditType,
    status:         fields.status         ?? AUDIT_STATUS.PLANNED,
    scope:          fields.scope          ?? null,
    startDate:      fields.startDate      ?? null,
    endDate:        fields.endDate        ?? null,
    conclusion:     fields.conclusion     ?? null,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

export const auditConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId ?? null,
      leadAuditorId:  data.leadAuditorId  ?? null,
      title:          data.title,
      auditType:      data.auditType,
      status:         data.status,
      scope:          data.scope          ?? null,
      startDate:      data.startDate      ?? null,
      endDate:        data.endDate        ?? null,
      conclusion:     data.conclusion     ?? null,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "audits"
 *   - organizationId ASC, status ASC
 *   - leadAuditorId ASC
 *   - auditType ASC
 *   - status ASC
 */
