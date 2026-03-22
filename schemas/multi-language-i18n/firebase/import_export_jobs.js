// import_export_jobs: Batch import/export job tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const IMPORT_EXPORT_TYPE = /** @type {const} */ ({
  IMPORT: "import",
  EXPORT: "export",
});

export const IMPORT_EXPORT_STATUS = /** @type {const} */ ({
  PENDING:    "pending",
  PROCESSING: "processing",
  COMPLETED:  "completed",
  FAILED:     "failed",
});

/**
 * @typedef {Object} ImportExportJobDocument
 * @property {string}         id
 * @property {string}         type
 * @property {string}         format
 * @property {string}         status
 * @property {string|null}    localeId
 * @property {string|null}    namespaceId
 * @property {string|null}    filePath
 * @property {number}         totalCount
 * @property {number}         processedCount
 * @property {string|null}    errorMessage
 * @property {Object|null}    options
 * @property {string|null}    createdBy
 * @property {Timestamp|null} startedAt
 * @property {Timestamp|null} completedAt
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Pick<ImportExportJobDocument, "type" | "format"> & Partial<Pick<ImportExportJobDocument, "status" | "localeId" | "namespaceId" | "filePath" | "totalCount" | "processedCount" | "errorMessage" | "options" | "createdBy" | "startedAt" | "completedAt">>} fields
 * @returns {Omit<ImportExportJobDocument, "id">}
 */
export function createImportExportJob(fields) {
  return {
    type:           fields.type,
    format:         fields.format,
    status:         fields.status         ?? IMPORT_EXPORT_STATUS.PENDING,
    localeId:       fields.localeId       ?? null,
    namespaceId:    fields.namespaceId    ?? null,
    filePath:       fields.filePath       ?? null,
    totalCount:     fields.totalCount     ?? 0,
    processedCount: fields.processedCount ?? 0,
    errorMessage:   fields.errorMessage   ?? null,
    options:        fields.options        ?? null,
    createdBy:      fields.createdBy      ?? null,
    startedAt:      fields.startedAt      ?? null,
    completedAt:    fields.completedAt    ?? null,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

export const importExportJobConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      type:           data.type,
      format:         data.format,
      status:         data.status         ?? IMPORT_EXPORT_STATUS.PENDING,
      localeId:       data.localeId       ?? null,
      namespaceId:    data.namespaceId    ?? null,
      filePath:       data.filePath       ?? null,
      totalCount:     data.totalCount     ?? 0,
      processedCount: data.processedCount ?? 0,
      errorMessage:   data.errorMessage   ?? null,
      options:        data.options        ?? null,
      createdBy:      data.createdBy      ?? null,
      startedAt:      data.startedAt      ?? null,
      completedAt:    data.completedAt    ?? null,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - import_export_jobs.type ASC + import_export_jobs.status ASC
 *
 * Single-field:
 *   - import_export_jobs.status    ASC
 *   - import_export_jobs.createdBy ASC
 */
