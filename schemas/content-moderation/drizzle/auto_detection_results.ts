// auto_detection_results: Automated content analysis results.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  numeric,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { moderationQueueItems } from "./moderation_queue_items";
import { moderationRules } from "./moderation_rules";

export const detectionContentTypeEnum = pgEnum("detection_content_type", [
  "post",
  "comment",
  "message",
  "user",
  "media",
]);

export const detectionMethodEnum = pgEnum("detection_method", [
  "ml_classifier",
  "hash_match",
  "keyword",
  "regex",
  "blocklist",
]);

export const autoDetectionResults = pgTable(
  "auto_detection_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentType: detectionContentTypeEnum("content_type").notNull(), // What type of content was analyzed.
    contentId: text("content_id").notNull(), // What was analyzed.
    queueItemId: uuid("queue_item_id").references(
      () => moderationQueueItems.id,
      { onDelete: "set null" }
    ), // Queue item created/updated by this detection.
    detectionMethod: detectionMethodEnum("detection_method").notNull(), // Type of detection that produced this result.
    detectionSource: text("detection_source").notNull(), // Specific detector name (e.g., "perspective", "openai", "photodna").
    category: text("category"), // Detected violation category (e.g., "toxicity", "hate_speech", "csam_hash_match").
    confidenceScore: numeric("confidence_score"), // Detection confidence, 0.00 to 1.00. Nullable: some methods (keyword match) are binary.
    matchedValue: text("matched_value"), // What triggered the match (keyword, regex pattern, hash ID, etc.).
    isActionable: boolean("is_actionable").notNull().default(false), // Whether this result met the threshold for automated action.
    metadata: jsonb("metadata").default(sql`'{}'`), // Detection-specific extra data (per-category scores, hash distances, etc.).
    ruleId: uuid("rule_id").references(() => moderationRules.id, {
      onDelete: "set null",
    }), // The rule that triggered this detection, if applicable.

    // Immutable. Detections are append-only — no updated_at.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_auto_detection_results_content").on(
      table.contentType,
      table.contentId
    ),
    index("idx_auto_detection_results_queue_item_id").on(table.queueItemId),
    index("idx_auto_detection_results_detection_method").on(
      table.detectionMethod
    ),
    index("idx_auto_detection_results_detection_source").on(
      table.detectionSource
    ),
    index("idx_auto_detection_results_is_actionable").on(table.isActionable),
    index("idx_auto_detection_results_created_at").on(table.createdAt),
  ]
);
