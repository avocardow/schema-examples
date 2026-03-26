// compliance_activities: audit trail of compliance-related actions across all entity types.

import { Timestamp } from "firebase/firestore";

export const ACTIVITY_TYPE = /** @type {const} */ ({
  CONTROL_CREATED:     "control_created",
  CONTROL_UPDATED:     "control_updated",
  CONTROL_TESTED:      "control_tested",
  RISK_CREATED:        "risk_created",
  RISK_UPDATED:        "risk_updated",
  RISK_CLOSED:         "risk_closed",
  POLICY_CREATED:      "policy_created",
  POLICY_APPROVED:     "policy_approved",
  POLICY_ACKNOWLEDGED: "policy_acknowledged",
  AUDIT_STARTED:       "audit_started",
  AUDIT_COMPLETED:     "audit_completed",
  FINDING_CREATED:     "finding_created",
  FINDING_REMEDIATED:  "finding_remediated",
  FINDING_CLOSED:      "finding_closed",
  EVIDENCE_COLLECTED:  "evidence_collected",
});

export const ACTIVITY_ENTITY_TYPE = /** @type {const} */ ({
  CONTROL:              "control",
  RISK:                 "risk",
  POLICY:               "policy",
  POLICY_VERSION:       "policy_version",
  AUDIT:                "audit",
  AUDIT_FINDING:        "audit_finding",
  FINDING_REMEDIATION:  "finding_remediation",
  EVIDENCE:             "evidence",
});

/**
 * @typedef {Object} ComplianceActivityDocument
 * @property {string}      id
 * @property {string|null} organizationId - FK → organizations
 * @property {string|null} actorId        - FK → users
 * @property {typeof ACTIVITY_TYPE[keyof typeof ACTIVITY_TYPE]}             activityType
 * @property {typeof ACTIVITY_ENTITY_TYPE[keyof typeof ACTIVITY_ENTITY_TYPE]} entityType
 * @property {string}      entityId - Polymorphic, no FK constraint
 * @property {string}      summary
 * @property {Object|null} details  - JSON object
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ComplianceActivityDocument, "id" | "createdAt">} fields
 * @returns {Omit<ComplianceActivityDocument, "id">}
 */
export function createComplianceActivity(fields) {
  return {
    organizationId: fields.organizationId ?? null,
    actorId:        fields.actorId        ?? null,
    activityType:   fields.activityType,
    entityType:     fields.entityType,
    entityId:       fields.entityId,
    summary:        fields.summary,
    details:        fields.details        ?? null,
    createdAt:      Timestamp.now(),
  };
}

export const complianceActivityConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId ?? null,
      actorId:        data.actorId        ?? null,
      activityType:   data.activityType,
      entityType:     data.entityType,
      entityId:       data.entityId,
      summary:        data.summary,
      details:        data.details        ?? null,
      createdAt:      data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "compliance_activities"
 *   - organizationId ASC, createdAt DESC
 *   - actorId ASC
 *   - activityType ASC
 *   - entityType ASC, entityId ASC
 *   - createdAt DESC
 */
