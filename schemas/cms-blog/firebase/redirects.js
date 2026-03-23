// redirects: URL redirect rules for SEO preservation.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} RedirectDocument
 * @property {string} id
 * @property {string} sourcePath
 * @property {string} targetPath
 * @property {number} statusCode
 * @property {boolean} isActive
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createRedirect(fields) {
  return {
    sourcePath: fields.sourcePath,
    targetPath: fields.targetPath,
    statusCode: fields.statusCode ?? 301,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const redirectConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      sourcePath: data.sourcePath,
      targetPath: data.targetPath,
      statusCode: data.statusCode,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - redirects: sourcePath ASC (unique)
  - redirects: isActive ASC
*/
