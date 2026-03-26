// vendor_documents: Uploaded verification documents for vendor identity and compliance.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VENDOR_DOCUMENT_TYPE = /** @type {const} */ ({
  BUSINESS_LICENSE: "business_license",
  TAX_CERTIFICATE: "tax_certificate",
  IDENTITY_PROOF: "identity_proof",
  BANK_STATEMENT: "bank_statement",
  OTHER: "other",
});

export const VENDOR_DOCUMENT_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

/**
 * @typedef {Object} VendorDocumentDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {typeof VENDOR_DOCUMENT_TYPE[keyof typeof VENDOR_DOCUMENT_TYPE]} type
 * @property {string} fileUrl
 * @property {string} fileName
 * @property {typeof VENDOR_DOCUMENT_STATUS[keyof typeof VENDOR_DOCUMENT_STATUS]} status
 * @property {string|null} rejectionReason
 * @property {string|null} reviewedBy - FK → users
 * @property {Timestamp|null} reviewedAt
 * @property {Timestamp|null} expiresAt
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<VendorDocumentDocument, "id" | "createdAt">} data
 * @returns {Omit<VendorDocumentDocument, "id">}
 */
export function createVendorDocument(data) {
  return {
    vendorId: data.vendorId,
    type: data.type,
    fileUrl: data.fileUrl,
    fileName: data.fileName,
    status: data.status ?? VENDOR_DOCUMENT_STATUS.PENDING,
    rejectionReason: data.rejectionReason ?? null,
    reviewedBy: data.reviewedBy ?? null,
    reviewedAt: data.reviewedAt ?? null,
    expiresAt: data.expiresAt ?? null,
    createdAt: Timestamp.now(),
  };
}

export const vendorDocumentConverter = {
  toFirestore(doc) {
    const { id, ...data } = doc;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
      type: data.type,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      status: data.status,
      rejectionReason: data.rejectionReason ?? null,
      reviewedBy: data.reviewedBy ?? null,
      reviewedAt: data.reviewedAt ?? null,
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt,
    };
  },
};

// Suggested indexes:
// - vendorId ASC, type ASC
// - status ASC
