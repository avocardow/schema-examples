// milestones: time-boxed goals for grouping and tracking task progress.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const MILESTONE_STATUSES = /** @type {const} */ ({
  PLANNED: "planned",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} MilestoneDocument
 * @property {string} id
 * @property {string} projectId - FK → projects
 * @property {string} name
 * @property {string | null} description
 * @property {typeof MILESTONE_STATUSES[keyof typeof MILESTONE_STATUSES]} status
 * @property {string | null} startDate
 * @property {string | null} endDate
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<MilestoneDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<MilestoneDocument, "id">}
 */
export function createMilestone(fields) {
  return {
    projectId: fields.projectId,
    name: fields.name,
    description: fields.description ?? null,
    status: fields.status ?? MILESTONE_STATUSES.PLANNED,
    startDate: fields.startDate ?? null,
    endDate: fields.endDate ?? null,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const milestoneConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      projectId: data.projectId,
      name: data.name,
      description: data.description ?? null,
      status: data.status,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "milestones"
 *   - projectId ASC, status ASC
 *   - projectId ASC, position ASC
 */
