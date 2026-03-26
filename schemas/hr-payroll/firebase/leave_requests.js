// leave_requests: time off requests with date ranges and approval workflow.

import { Timestamp } from "firebase/firestore";

export const LEAVE_REQUEST_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} LeaveRequestDocument
 * @property {string} id
 * @property {string} employeeId - FK → employees
 * @property {string} leavePolicyId - FK → leave_policies
 * @property {string} startDate - Calendar date "YYYY-MM-DD"
 * @property {string} endDate - Calendar date "YYYY-MM-DD"
 * @property {number} daysRequested - decimal
 * @property {typeof LEAVE_REQUEST_STATUS[keyof typeof LEAVE_REQUEST_STATUS]} status
 * @property {string | null} reason
 * @property {string | null} reviewerId - FK → users
 * @property {import("firebase/firestore").Timestamp | null} reviewedAt
 * @property {string | null} reviewerNote
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LeaveRequestDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<LeaveRequestDocument, "id">}
 */
export function createLeaveRequest(fields) {
  return {
    employeeId: fields.employeeId,
    leavePolicyId: fields.leavePolicyId,
    startDate: fields.startDate,
    endDate: fields.endDate,
    daysRequested: fields.daysRequested,
    status: fields.status ?? LEAVE_REQUEST_STATUS.PENDING,
    reason: fields.reason ?? null,
    reviewerId: fields.reviewerId ?? null,
    reviewedAt: fields.reviewedAt ?? null,
    reviewerNote: fields.reviewerNote ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const leaveRequestConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      employeeId: data.employeeId,
      leavePolicyId: data.leavePolicyId,
      startDate: data.startDate,
      endDate: data.endDate,
      daysRequested: data.daysRequested,
      status: data.status,
      reason: data.reason ?? null,
      reviewerId: data.reviewerId ?? null,
      reviewedAt: data.reviewedAt ?? null,     // Timestamp | null
      reviewerNote: data.reviewerNote ?? null,
      createdAt: data.createdAt,               // Timestamp
      updatedAt: data.updatedAt,               // Timestamp
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "leave_requests"
 *   - employeeId ASC, startDate DESC
 *   - leavePolicyId ASC
 *   - status ASC
 *   - startDate ASC
 */
