// compliance_taggables: polymorphic join table linking tags to compliance entities.

import { Timestamp } from "firebase/firestore";

export const TAGGABLE_TYPE = /** @type {const} */ ({
  CONTROL:  "control",
  RISK:     "risk",
  POLICY:   "policy",
  AUDIT:    "audit",
  FINDING:  "finding",
  EVIDENCE: "evidence",
});

/**
 * @typedef {Object} ComplianceTaggableDocument
 * @property {string} id
 * @property {string} tagId        - FK → compliance_tags
 * @property {typeof TAGGABLE_TYPE[keyof typeof TAGGABLE_TYPE]} taggableType
 * @property {string} taggableId   - Polymorphic, no FK constraint
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ComplianceTaggableDocument, "id" | "createdAt">} fields
 * @returns {Omit<ComplianceTaggableDocument, "id">}
 */
export function createComplianceTaggable(fields) {
  return {
    tagId:        fields.tagId,
    taggableType: fields.taggableType,
    taggableId:   fields.taggableId,
    createdAt:    Timestamp.now(),
  };
}

export const complianceTaggableConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      tagId:        data.tagId,
      taggableType: data.taggableType,
      taggableId:   data.taggableId,
      createdAt:    data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "compliance_taggables"
 *   - tagId ASC, taggableType ASC, taggableId ASC (unique)
 *   - taggableType ASC
 *   - taggableId ASC
 */
