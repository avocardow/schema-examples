// moderation_policies: Community/platform rule definitions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "moderation_policies"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - scope discriminates where a policy applies: global (platform-wide),
 *     community, or channel. scopeId identifies the target when not global.
 *   - violationCategoryId links to violation_categories for classification
 *     when a rule is violated. Nullable — policies can exist without a category.
 *   - sortOrder controls display ordering within a scope.
 *   - isActive enables soft-disable without deleting the policy.
 */

export const MODERATION_POLICY_SCOPE = /** @type {const} */ ({
  GLOBAL: "global",
  COMMUNITY: "community",
  CHANNEL: "channel",
});

/**
 * @typedef {Object} ModerationPolicyDocument
 * @property {string}         id                     - Document ID (from snapshot.id).
 * @property {typeof MODERATION_POLICY_SCOPE[keyof typeof MODERATION_POLICY_SCOPE]} scope - Where this policy applies.
 * @property {string|null}    scopeId                - ID of the community/channel. Null when scope = global.
 * @property {string}         title                  - Short policy title (e.g., "No Hate Speech").
 * @property {string}         description            - Full policy text explaining what's prohibited and why.
 * @property {string|null}    violationCategoryId    - FK → violation_categories. Which violation category this policy maps to.
 * @property {number}         sortOrder              - Display ordering within the scope.
 * @property {boolean}        isActive               - Soft-disable without deleting.
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ModerationPolicyDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ModerationPolicyDocument, "id">}
 */
export function createModerationPolicy(fields) {
  return {
    scope:                 fields.scope               ?? MODERATION_POLICY_SCOPE.GLOBAL,
    scopeId:               fields.scopeId             ?? null,
    title:                 fields.title,
    description:           fields.description,
    violationCategoryId:   fields.violationCategoryId ?? null,
    sortOrder:             fields.sortOrder           ?? 0,
    isActive:              fields.isActive            ?? true,
    createdAt:             Timestamp.now(),
    updatedAt:             Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("moderation_policies").withConverter(moderationPolicyConverter)
 */
export const moderationPolicyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                   snapshot.id,
      scope:                data.scope,
      scopeId:              data.scopeId              ?? null,
      title:                data.title,
      description:          data.description,
      violationCategoryId:  data.violationCategoryId  ?? null,
      sortOrder:            data.sortOrder,
      isActive:             data.isActive,
      createdAt:            data.createdAt,
      updatedAt:            data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - moderation_policies.scope    ASC
 *     moderation_policies.scopeId  ASC
 *     — "All policies for this community/channel."
 *
 * Single-field:
 *   - moderation_policies.violationCategoryId ASC  — "All policies linked to this violation category."
 *   - moderation_policies.isActive            ASC  — "All active policies."
 */
