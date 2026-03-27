// member_activities: Log of member actions that may trigger earning rules.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MemberActivityDocument
 * @property {string} id
 * @property {string} memberId - FK → loyalty_members
 * @property {string} activityType
 * @property {string|null} description
 * @property {string|null} source
 * @property {string|null} referenceType
 * @property {string|null} referenceId
 * @property {number|null} monetaryValue
 * @property {string|null} currency
 * @property {number|null} pointsAwarded
 * @property {string|null} transactionId - FK → points_transactions
 * @property {Object|null} metadata
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<MemberActivityDocument, "id" | "createdAt">} data
 * @returns {Omit<MemberActivityDocument, "id">}
 */
export function createMemberActivity(data) {
  return {
    memberId: data.memberId,
    activityType: data.activityType,
    description: data.description ?? null,
    source: data.source ?? null,
    referenceType: data.referenceType ?? null,
    referenceId: data.referenceId ?? null,
    monetaryValue: data.monetaryValue ?? null,
    currency: data.currency ?? null,
    pointsAwarded: data.pointsAwarded ?? null,
    transactionId: data.transactionId ?? null,
    metadata: data.metadata ?? null,
    createdAt: Timestamp.now(),
  };
}

export const memberActivityConverter = {
  toFirestore(activity) {
    const { id, ...data } = activity;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      memberId: data.memberId,
      activityType: data.activityType,
      description: data.description ?? null,
      source: data.source ?? null,
      referenceType: data.referenceType ?? null,
      referenceId: data.referenceId ?? null,
      monetaryValue: data.monetaryValue ?? null,
      currency: data.currency ?? null,
      pointsAwarded: data.pointsAwarded ?? null,
      transactionId: data.transactionId ?? null,
      metadata: data.metadata ?? null,
      createdAt: data.createdAt,
    };
  },
};

// Suggested Firestore indexes:
// - member_activities: memberId ASC, createdAt DESC
// - member_activities: activityType ASC
// - member_activities: referenceType ASC, referenceId ASC
// - member_activities: transactionId ASC
