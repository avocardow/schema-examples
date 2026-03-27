// loyalty_members: Enrollment of a user in a loyalty program with cached point balances.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const LOYALTY_MEMBER_STATUS = /** @type {const} */ ({
  ACTIVE: "active",
  SUSPENDED: "suspended",
  BANNED: "banned",
});

/**
 * @typedef {Object} LoyaltyMemberDocument
 * @property {string} id
 * @property {string} programId - FK → loyalty_programs
 * @property {string} userId - FK → users
 * @property {string} memberNumber
 * @property {typeof LOYALTY_MEMBER_STATUS[keyof typeof LOYALTY_MEMBER_STATUS]} status
 * @property {number} pointsBalance
 * @property {number} pointsPending
 * @property {number} lifetimePoints
 * @property {number} pointsRedeemed
 * @property {number} pointsExpired
 * @property {Timestamp} enrolledAt
 * @property {Timestamp|null} suspendedAt
 * @property {Object|null} metadata
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<LoyaltyMemberDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<LoyaltyMemberDocument, "id">}
 */
export function createLoyaltyMember(data) {
  return {
    programId: data.programId,
    userId: data.userId,
    memberNumber: data.memberNumber,
    status: data.status ?? LOYALTY_MEMBER_STATUS.ACTIVE,
    pointsBalance: data.pointsBalance ?? 0,
    pointsPending: data.pointsPending ?? 0,
    lifetimePoints: data.lifetimePoints ?? 0,
    pointsRedeemed: data.pointsRedeemed ?? 0,
    pointsExpired: data.pointsExpired ?? 0,
    enrolledAt: data.enrolledAt ?? Timestamp.now(),
    suspendedAt: data.suspendedAt ?? null,
    metadata: data.metadata ?? {},
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const loyaltyMemberConverter = {
  toFirestore(member) {
    const { id, ...data } = member;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      programId: data.programId,
      userId: data.userId,
      memberNumber: data.memberNumber,
      status: data.status,
      pointsBalance: data.pointsBalance,
      pointsPending: data.pointsPending,
      lifetimePoints: data.lifetimePoints,
      pointsRedeemed: data.pointsRedeemed,
      pointsExpired: data.pointsExpired,
      enrolledAt: data.enrolledAt,
      suspendedAt: data.suspendedAt ?? null,
      metadata: data.metadata ?? {},
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - loyalty_members: programId ASC, userId ASC (unique per program)
// - loyalty_members: userId ASC
// - loyalty_members: status ASC
// - loyalty_members: pointsBalance DESC
