// project_members: membership and role assignments linking users to projects.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PROJECT_MEMBER_ROLES = /** @type {const} */ ({
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  VIEWER: "viewer",
});

/**
 * @typedef {Object} ProjectMemberDocument
 * @property {string} id
 * @property {string} projectId - FK → projects
 * @property {string} userId - FK → users
 * @property {typeof PROJECT_MEMBER_ROLES[keyof typeof PROJECT_MEMBER_ROLES]} role
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ProjectMemberDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ProjectMemberDocument, "id">}
 */
export function createProjectMember(fields) {
  return {
    projectId: fields.projectId,
    userId: fields.userId,
    role: fields.role ?? PROJECT_MEMBER_ROLES.MEMBER,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const projectMemberConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      projectId: data.projectId,
      userId: data.userId,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "project_members"
 *   - projectId ASC, userId ASC (unique)
 *   - userId ASC
 */
