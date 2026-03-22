// moderation_rules: Configurable auto-moderation rules.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "moderation_rules"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - triggerConfig and actionConfig are JSON blobs — conditions vary too widely
 *     for normalized columns (follows Discord's trigger_metadata pattern).
 *   - Priority-based evaluation with first-match semantics prevents conflicting
 *     rule outcomes. Higher priority = evaluated first.
 *   - Rules reference keyword_lists by ID, enabling list reuse across rules.
 */

export const MODERATION_RULE_SCOPE = /** @type {const} */ ({
  GLOBAL: "global",
  COMMUNITY: "community",
  CHANNEL: "channel",
});

export const MODERATION_RULE_TRIGGER_TYPE = /** @type {const} */ ({
  KEYWORD: "keyword",
  REGEX: "regex",
  ML_SCORE: "ml_score",
  HASH_MATCH: "hash_match",
  MENTION_SPAM: "mention_spam",
  USER_ATTRIBUTE: "user_attribute",
});

export const MODERATION_RULE_ACTION_TYPE = /** @type {const} */ ({
  BLOCK: "block",
  FLAG: "flag",
  HOLD: "hold",
  TIMEOUT: "timeout",
  NOTIFY: "notify",
});

/**
 * @typedef {Object} ModerationRuleDocument
 * @property {string}                                                                      id            - Document ID (from snapshot.id).
 * @property {string}                                                                      name          - Human-readable rule name (e.g., "Block Profanity").
 * @property {string|null}                                                                 description   - What this rule does and why it exists.
 * @property {typeof MODERATION_RULE_SCOPE[keyof typeof MODERATION_RULE_SCOPE]}             scope         - Where this rule applies: "global", "community", or "channel".
 * @property {string|null}                                                                 scopeId       - Community/channel ID. Null when scope = global.
 * @property {typeof MODERATION_RULE_TRIGGER_TYPE[keyof typeof MODERATION_RULE_TRIGGER_TYPE]} triggerType - What type of content analysis triggers this rule.
 * @property {Object}                                                                      triggerConfig - Trigger-specific configuration (varies by triggerType).
 * @property {typeof MODERATION_RULE_ACTION_TYPE[keyof typeof MODERATION_RULE_ACTION_TYPE]} actionType   - What happens when the rule triggers.
 * @property {Object|null}                                                                 actionConfig  - Action-specific parameters. Null when no extra config needed.
 * @property {number}                                                                      priority      - Rule evaluation order. Higher = evaluated first.
 * @property {boolean}                                                                     isEnabled     - Disable without deleting.
 * @property {string}                                                                      createdBy     - FK → users
 * @property {import("firebase/firestore").Timestamp}                                      createdAt
 * @property {import("firebase/firestore").Timestamp}                                      updatedAt
 */

/**
 * @param {Omit<ModerationRuleDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ModerationRuleDocument, "id">}
 */
export function createModerationRule(fields) {
  return {
    name:          fields.name,
    description:   fields.description   ?? null,
    scope:         fields.scope         ?? MODERATION_RULE_SCOPE.GLOBAL,
    scopeId:       fields.scopeId       ?? null,
    triggerType:    fields.triggerType,
    triggerConfig:  fields.triggerConfig,
    actionType:     fields.actionType,
    actionConfig:   fields.actionConfig  ?? {},
    priority:      fields.priority      ?? 0,
    isEnabled:     fields.isEnabled     ?? true,
    createdBy:     fields.createdBy,
    createdAt:     Timestamp.now(),
    updatedAt:     Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("moderation_rules").withConverter(moderationRuleConverter)
 */
export const moderationRuleConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      name:          data.name,
      description:   data.description   ?? null,
      scope:         data.scope,
      scopeId:       data.scopeId       ?? null,
      triggerType:    data.triggerType,
      triggerConfig:  data.triggerConfig,
      actionType:     data.actionType,
      actionConfig:   data.actionConfig  ?? null,
      priority:      data.priority,
      isEnabled:     data.isEnabled,
      createdBy:     data.createdBy,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - moderation_rules.scope     ASC
 *     moderation_rules.scopeId   ASC
 *     moderation_rules.isEnabled ASC
 *     — "All enabled rules for this community/channel."
 *
 *   - moderation_rules.isEnabled ASC
 *     moderation_rules.priority  DESC
 *     — "Active rules in evaluation order."
 *
 * Single-field:
 *   - moderation_rules.triggerType ASC — "All rules of a given trigger type."
 */
