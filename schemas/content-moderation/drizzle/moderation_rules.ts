// moderation_rules: Configurable auto-moderation rules.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../../auth-rbac/drizzle/users";

export const moderationRuleScopeEnum = pgEnum("moderation_rule_scope", [
  "global",
  "community",
  "channel",
]);

export const moderationRuleTriggerTypeEnum = pgEnum(
  "moderation_rule_trigger_type",
  [
    "keyword",
    "regex",
    "ml_score",
    "hash_match",
    "mention_spam",
    "user_attribute",
  ]
);

export const moderationRuleActionTypeEnum = pgEnum(
  "moderation_rule_action_type",
  ["block", "flag", "hold", "timeout", "notify"]
);

export const moderationRules = pgTable(
  "moderation_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // Human-readable rule name (e.g., "Block Profanity", "Flag Toxicity > 0.8").
    description: text("description"), // What this rule does and why it exists.
    scope: moderationRuleScopeEnum("scope").notNull().default("global"), // Where this rule applies.
    scopeId: text("scope_id"), // Community/channel ID. Null when scope = global.
    triggerType: moderationRuleTriggerTypeEnum("trigger_type").notNull(),
    // keyword = matches words/phrases from a keyword_list.
    // regex = matches a regex pattern.
    // ml_score = ML model confidence exceeds threshold.
    // hash_match = perceptual hash match (PhotoDNA, etc.).
    // mention_spam = excessive @mentions.
    // user_attribute = checks user properties (age, karma, etc.).
    triggerConfig: jsonb("trigger_config").notNull(), // Trigger-specific configuration (keyword lists, patterns, thresholds, etc.).
    actionType: moderationRuleActionTypeEnum("action_type").notNull(),
    // block = prevent content from being posted.
    // flag = post the content but add to moderation queue.
    // hold = hold for moderator approval before posting.
    // timeout = temporarily restrict the user.
    // notify = alert moderators without affecting content.
    actionConfig: jsonb("action_config").default(sql`'{}'`), // Action-specific parameters (duration, channel, custom message, etc.).
    priority: integer("priority").notNull().default(0), // Rule evaluation order. Higher = evaluated first. First matching rule wins.
    isEnabled: boolean("is_enabled").notNull().default(true), // Disable without deleting.
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_moderation_rules_scope").on(
      table.scope,
      table.scopeId,
      table.isEnabled
    ),
    index("idx_moderation_rules_trigger_type").on(table.triggerType),
    index("idx_moderation_rules_enabled_priority").on(
      table.isEnabled,
      table.priority
    ),
  ]
);
