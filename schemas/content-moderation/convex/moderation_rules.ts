// moderation_rules: Configurable auto-moderation rules.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const moderation_rules = defineTable({
  // Core identity
  name: v.string(), // Human-readable rule name (e.g., "Block Profanity", "Flag Toxicity > 0.8").
  description: v.optional(v.string()), // What this rule does and why it exists.

  // Scope
  scope: v.union(v.literal("global"), v.literal("community"), v.literal("channel")),
  scopeId: v.optional(v.string()), // Community/channel ID. Null when scope = global.

  // Trigger
  triggerType: v.union(
    v.literal("keyword"),
    v.literal("regex"),
    v.literal("ml_score"),
    v.literal("hash_match"),
    v.literal("mention_spam"),
    v.literal("user_attribute"),
  ),
  triggerConfig: v.any(), // Trigger-specific configuration (keyword lists, regex patterns, ML thresholds, etc.).

  // Action
  actionType: v.union(
    v.literal("block"),
    v.literal("flag"),
    v.literal("hold"),
    v.literal("timeout"),
    v.literal("notify"),
  ),
  actionConfig: v.optional(v.any()), // Action-specific parameters (duration, channel, custom message, etc.).

  // Evaluation
  priority: v.number(), // Rule evaluation order. Higher = evaluated first. First match wins.
  isEnabled: v.boolean(), // Disable without deleting.

  // Ownership
  createdBy: v.id("users"),
  updatedAt: v.number(),
  // no id or createdAt — Convex provides _id and _creationTime
})
  .index("by_scope_and_enabled", ["scope", "scopeId", "isEnabled"])
  .index("by_trigger_type", ["triggerType"])
  .index("by_enabled_and_priority", ["isEnabled", "priority"]);
