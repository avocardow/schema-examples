// employee_documents: employment-related document metadata with optional expiry tracking.

import { Timestamp } from "firebase/firestore";

export const DOCUMENT_TYPE = /** @type {const} */ ({
  CONTRACT: "contract",
  TAX_FORM: "tax_form",
  IDENTIFICATION: "identification",
  CERTIFICATION: "certification",
  OFFER_LETTER: "offer_letter",
  PERFORMANCE_REVIEW: "performance_review",
  OTHER: "other",
});

export const DOCUMENT_STATUS = /** @type {const} */ ({
  ACTIVE: "active",
  EXPIRED: "expired",
  SUPERSEDED: "superseded",
  ARCHIVED: "archived",
});

/**
 * @typedef {Object} EmployeeDocumentDocument
 * @property {string} id
 * @property {string} employeeId - FK → employees
 * @property {string} fileId - FK → files
 * @property {typeof DOCUMENT_TYPE[keyof typeof DOCUMENT_TYPE]} type
 * @property {string} name
 * @property {string | null} description
 * @property {string | null} issuedDate - Calendar date "YYYY-MM-DD"
 * @property {string | null} expiryDate - Calendar date "YYYY-MM-DD"
 * @property {typeof DOCUMENT_STATUS[keyof typeof DOCUMENT_STATUS]} status
 * @property {string | null} uploadedBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EmployeeDocumentDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EmployeeDocumentDocument, "id">}
 */
export function createEmployeeDocument(fields) {
  return {
    employeeId: fields.employeeId,
    fileId: fields.fileId,
    type: fields.type,
    name: fields.name,
    description: fields.description ?? null,
    issuedDate: fields.issuedDate ?? null,
    expiryDate: fields.expiryDate ?? null,
    status: fields.status ?? DOCUMENT_STATUS.ACTIVE,
    uploadedBy: fields.uploadedBy ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const employeeDocumentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      employeeId: data.employeeId,
      fileId: data.fileId,
      type: data.type,
      name: data.name,
      description: data.description ?? null,
      issuedDate: data.issuedDate ?? null,
      expiryDate: data.expiryDate ?? null,
      status: data.status,
      uploadedBy: data.uploadedBy ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "employee_documents"
 *   - employeeId ASC, type ASC
 *   - fileId ASC
 *   - expiryDate ASC
 *   - status ASC
 */
