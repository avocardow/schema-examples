// violation_categories: Hierarchical taxonomy of content violation types.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "violation_categories"
 * Document ID: Firestore auto-generated
 *
 * Hierarchical taxonomy of content violation types. Supports multi-level categorization
 * aligned with industry standards (TSPA abuse taxonomy, DSA 19-category list, OpenAI harm
 * categories). Self-referencing parentId enables roll-up reporting — e.g., "Hate Speech"
 * parent with "Racial Hatred", "Religious Hatred", "Gender-Based Hatred" children.
 */

export const VIOLATION_SEVERITY = /** @type {const} */ ({
  INFO: "info",
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
});

/**
 * @typedef {Object} ViolationCategoryDocument
 * @property {string}      id
 * @property {string}      name          - Machine-readable identifier (e.g., "hate_speech", "csam"). Unique.
 * @property {string}      displayName   - Human-readable label (e.g., "Hate Speech").
 * @property {string|null} description   - Detailed explanation of what this category covers.
 * @property {string|null} parentId      - FK → violation_categories. Null = top-level category.
 * @property {typeof VIOLATION_SEVERITY[keyof typeof VIOLATION_SEVERITY]} severity
 *   - Default severity when this category is cited in an action.
 * @property {boolean}     isActive      - Soft-disable without deleting.
 * @property {number}      sortOrder     - Display ordering within the parent group.
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Pick<ViolationCategoryDocument, "name" | "displayName"> & Partial<Pick<ViolationCategoryDocument, "description" | "parentId" | "severity" | "isActive" | "sortOrder">>} fields
 * @returns {Omit<ViolationCategoryDocument, "id">}
 */
export function createViolationCategory(fields) {
  return {
    name:        fields.name,
    displayName: fields.displayName,
    description: fields.description ?? null,
    parentId:    fields.parentId    ?? null,
    severity:    fields.severity    ?? VIOLATION_SEVERITY.MEDIUM,
    isActive:    fields.isActive    ?? true,
    sortOrder:   fields.sortOrder   ?? 0,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("violation_categories").withConverter(violationCategoryConverter)
 */
export const violationCategoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      displayName: data.displayName,
      description: data.description ?? null,
      parentId:    data.parentId    ?? null,
      severity:    data.severity,
      isActive:    data.isActive,
      sortOrder:   data.sortOrder,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - violation_categories.name       ASC  — Unique lookup by machine-readable name.
 *   - violation_categories.parentId   ASC  — "All children of this category."
 *
 * Composite:
 *   - violation_categories.isActive ASC, sortOrder ASC  — Active categories in display order.
 */
