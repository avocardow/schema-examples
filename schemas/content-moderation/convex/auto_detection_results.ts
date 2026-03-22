// auto_detection_results: Automated content analysis results.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const auto_detection_results = defineTable({
  // What was analyzed
  contentType: v.union(
    v.literal("post"),
    v.literal("comment"),
    v.literal("message"),
    v.literal("user"),
    v.literal("media")
  ),
  contentId: v.string(),

  // Foreign keys
  queueItemId: v.optional(v.id("moderation_queue_items")), // Queue item created/updated by this detection. Set null: if queue item is deleted, result preserves history.
  ruleId: v.optional(v.id("moderation_rules")), // The rule that triggered this detection, if applicable.

  // Detection details
  detectionMethod: v.union(
    v.literal("ml_classifier"),
    v.literal("hash_match"),
    v.literal("keyword"),
    v.literal("regex"),
    v.literal("blocklist")
  ),
  detectionSource: v.string(), // Specific detector name (e.g., "perspective", "openai", "photodna").
  category: v.optional(v.string()), // Detected violation category (e.g., "toxicity", "hate_speech").
  confidenceScore: v.optional(v.number()), // Detection confidence, 0.00 to 1.00. Nullable: some methods are binary.
  matchedValue: v.optional(v.string()), // What triggered the match (keyword, pattern, hash ID). Null for ml_classifier.
  isActionable: v.boolean(), // Whether this result met the threshold for automated action.

  // Extra data
  metadata: v.optional(v.any()), // Detection-specific extra data (e.g., per-category scores, hash distance).

  // No updatedAt — detections are immutable.
  // No createdAt — Convex provides _creationTime.
})
  .index("by_content", ["contentType", "contentId"])
  .index("by_queue_item_id", ["queueItemId"])
  .index("by_detection_method", ["detectionMethod"])
  .index("by_detection_source", ["detectionSource"])
  .index("by_is_actionable", ["isActionable"])
  .index("by_creation_time", ["_creationTime"]);
