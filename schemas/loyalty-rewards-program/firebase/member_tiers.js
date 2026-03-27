// member_tiers: Assignment of members to tiers with temporal tracking and history.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MemberTierDocument
 * @property {string} id
 * @property {string} memberId - FK → loyalty_members
 * @property {string} tierId - FK → tiers
 * @property {boolean} isCurrent
 * @property {Timestamp} startedAt
 * @property {Timestamp|null} endsAt
 * @property {Timestamp|null} endedAt
 * @property {Object|null} qualificationSnapshot
 * @property {boolean} isManual
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<MemberTierDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<MemberTierDocument, "id">}
 */
export function createMemberTier(data) {
  return {
    memberId: data.memberId,
    tierId: data.tierId,
    isCurrent: data.isCurrent ?? true,
    startedAt: data.startedAt ?? Timestamp.now(),
    endsAt: data.endsAt ?? null,
    endedAt: data.endedAt ?? null,
    qualificationSnapshot: data.qualificationSnapshot ?? null,
    isManual: data.isManual ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const memberTierConverter = {
  toFirestore(memberTier) {
    const { id, ...data } = memberTier;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      memberId: data.memberId,
      tierId: data.tierId,
      isCurrent: data.isCurrent,
      startedAt: data.startedAt,
      endsAt: data.endsAt ?? null,
      endedAt: data.endedAt ?? null,
      qualificationSnapshot: data.qualificationSnapshot ?? null,
      isManual: data.isManual,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - member_tiers: memberId ASC, isCurrent ASC
// - member_tiers: tierId ASC
// - member_tiers: endsAt ASC
