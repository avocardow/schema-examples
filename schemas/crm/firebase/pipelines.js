// pipelines: configurable sales pipelines that contain ordered stages.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PipelineDocument
 * @property {string} id
 * @property {string} name
 * @property {string | null} description
 * @property {boolean} isDefault
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PipelineDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PipelineDocument, "id">}
 */
export function createPipeline(fields) {
  return {
    name: fields.name,
    description: fields.description ?? null,
    isDefault: fields.isDefault ?? false,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const pipelineConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description ?? null,
      isDefault: data.isDefault,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "pipelines"
 *   - position ASC
 *   - isDefault ASC
 */
