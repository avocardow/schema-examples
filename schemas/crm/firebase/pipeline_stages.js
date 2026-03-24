// pipeline_stages: ordered stages within a pipeline with win probability tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PipelineStageDocument
 * @property {string} id
 * @property {string} pipelineId - FK → pipelines
 * @property {string} name
 * @property {number} position
 * @property {number | null} winProbability
 * @property {boolean} isClosedWon
 * @property {boolean} isClosedLost
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PipelineStageDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PipelineStageDocument, "id">}
 */
export function createPipelineStage(fields) {
  return {
    pipelineId: fields.pipelineId,
    name: fields.name,
    position: fields.position ?? 0,
    winProbability: fields.winProbability ?? null,
    isClosedWon: fields.isClosedWon ?? false,
    isClosedLost: fields.isClosedLost ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const pipelineStageConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      pipelineId: data.pipelineId,
      name: data.name,
      position: data.position,
      winProbability: data.winProbability ?? null,
      isClosedWon: data.isClosedWon,
      isClosedLost: data.isClosedLost,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "pipeline_stages"
 *   - pipelineId ASC, position ASC
 */
