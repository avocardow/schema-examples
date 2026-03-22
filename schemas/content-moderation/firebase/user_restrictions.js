// user_restrictions: Active restrictions on user accounts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "user_restrictions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Supports multiple concurrent restrictions per user (e.g., muted in one
 *     community while on probation globally).
 *   - scope + scopeId localize a restriction; scopeId is null when scope = global.
 *   - Tracks the full lifecycle: who imposed it, when it expires, who lifted it
 *     if ended early.
 *   - moderationActionId links back to the originating moderation action.
 */

export const USER_RESTRICTION_TYPE = /** @type {const} */ ({
  BAN: "ban",
  MUTE: "mute",
  POST_RESTRICTION: "post_restriction",
  SHADOW_BAN: "shadow_ban",
  WARNING: "warning",
  PROBATION: "probation",
});

export const USER_RESTRICTION_SCOPE = /** @type {const} */ ({
  GLOBAL: "global",
  COMMUNITY: "community",
  CHANNEL: "channel",
});

/**
 * @typedef {Object} UserRestrictionDocument
 * @property {string}         id                 - Document ID (from snapshot.id).
 * @property {string}         userId             - FK → users. The restricted user.
 * @property {typeof USER_RESTRICTION_TYPE[keyof typeof USER_RESTRICTION_TYPE]} restrictionType
 * @property {typeof USER_RESTRICTION_SCOPE[keyof typeof USER_RESTRICTION_SCOPE]} scope
 * @property {string|null}    scopeId            - Community/channel ID. Null when scope = global.
 * @property {string|null}    reason             - Why the restriction was imposed.
 * @property {string|null}    moderationActionId - FK → moderation_actions. The action that created this restriction.
 * @property {string}         imposedBy          - FK → users. Moderator who imposed the restriction.
 * @property {Timestamp}      imposedAt          - When the restriction was imposed.
 * @property {Timestamp|null} expiresAt          - When the restriction expires. Null = permanent.
 * @property {boolean}        isActive           - Whether the restriction is currently in effect.
 * @property {string|null}    liftedBy           - FK → users. Moderator who lifted the restriction early.
 * @property {Timestamp|null} liftedAt           - When the restriction was lifted. Null = still active or expired.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<UserRestrictionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<UserRestrictionDocument, "id">}
 */
export function createUserRestriction(fields) {
  return {
    userId:             fields.userId,
    restrictionType:    fields.restrictionType,
    scope:              fields.scope              ?? USER_RESTRICTION_SCOPE.GLOBAL,
    scopeId:            fields.scopeId            ?? null,
    reason:             fields.reason             ?? null,
    moderationActionId: fields.moderationActionId ?? null,
    imposedBy:          fields.imposedBy,
    imposedAt:          fields.imposedAt          ?? Timestamp.now(),
    expiresAt:          fields.expiresAt          ?? null,
    isActive:           fields.isActive           ?? true,
    liftedBy:           fields.liftedBy           ?? null,
    liftedAt:           fields.liftedAt           ?? null,
    createdAt:          Timestamp.now(),
    updatedAt:          Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("user_restrictions").withConverter(userRestrictionConverter)
 */
export const userRestrictionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      userId:             data.userId,
      restrictionType:    data.restrictionType,
      scope:              data.scope,
      scopeId:            data.scopeId            ?? null,
      reason:             data.reason             ?? null,
      moderationActionId: data.moderationActionId ?? null,
      imposedBy:          data.imposedBy,
      imposedAt:          data.imposedAt,
      expiresAt:          data.expiresAt          ?? null,
      isActive:           data.isActive,
      liftedBy:           data.liftedBy           ?? null,
      liftedAt:           data.liftedAt           ?? null,
      createdAt:          data.createdAt,
      updatedAt:          data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - user_restrictions.userId         ASC
 *     user_restrictions.isActive       ASC
 *     — "All active restrictions for this user."
 *
 *   - user_restrictions.scope          ASC
 *     user_restrictions.scopeId        ASC
 *     — "All restrictions in this community/channel."
 *
 *   - user_restrictions.expiresAt      ASC
 *     user_restrictions.isActive       ASC
 *     — Cleanup job: find expired restrictions to deactivate.
 *
 * Single-field:
 *   - user_restrictions.restrictionType ASC  — "All bans" for reporting.
 *   - user_restrictions.imposedBy       ASC  — "All restrictions imposed by this moderator."
 */
