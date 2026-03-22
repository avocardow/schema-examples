// auto_detection_results: Automated content analysis results.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "auto_detection_results"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Each document is a single detection event on a piece of content.
 *     Multiple detectors can produce multiple results for the same content.
 *   - Detections are immutable (append-only). No updatedAt — once logged, never changed.
 *   - detectionSource is a free-form string, not an enum — new detectors are
 *     added without schema changes (e.g., "perspective", "photodna").
 *   - category is a free-form string — supports detector-specific category
 *     names without schema coupling.
 */

export const AUTO_DETECTION_CONTENT_TYPE = /** @type {const} */ ({
  POST:    "post",
  COMMENT: "comment",
  MESSAGE: "message",
  USER:    "user",
  MEDIA:   "media",
});

export const AUTO_DETECTION_METHOD = /** @type {const} */ ({
  ML_CLASSIFIER: "ml_classifier",
  HASH_MATCH:    "hash_match",
  KEYWORD:       "keyword",
  REGEX:         "regex",
  BLOCKLIST:     "blocklist",
});

/**
 * @typedef {Object} AutoDetectionResultDocument
 * @property {string}         id               - Document ID (from snapshot.id).
 * @property {typeof AUTO_DETECTION_CONTENT_TYPE[keyof typeof AUTO_DETECTION_CONTENT_TYPE]} contentType - What type of content was analyzed.
 * @property {string}         contentId        - ID of the analyzed content.
 * @property {string|null}    queueItemId      - FK → moderation_queue_items. Queue item created/updated by this detection.
 * @property {typeof AUTO_DETECTION_METHOD[keyof typeof AUTO_DETECTION_METHOD]} detectionMethod - Type of detection that produced this result.
 * @property {string}         detectionSource  - Specific detector name (e.g., "perspective", "openai", "photodna").
 * @property {string|null}    category         - Detected violation category (e.g., "toxicity", "hate_speech").
 * @property {number|null}    confidenceScore  - Detection confidence, 0.00 to 1.00. Null for binary methods.
 * @property {string|null}    matchedValue     - What triggered the match (keyword, pattern, hash ID). Null for ML classifiers.
 * @property {boolean}        isActionable     - Whether this result met the threshold for automated action.
 * @property {Object|null}    metadata         - Detection-specific extra data.
 * @property {string|null}    ruleId           - FK → moderation_rules. The rule that triggered this detection.
 * @property {import("firebase/firestore").Timestamp} createdAt - When the detection occurred. Immutable.
 */

/**
 * @param {Omit<AutoDetectionResultDocument, "id" | "createdAt">} fields
 * @returns {Omit<AutoDetectionResultDocument, "id">}
 */
export function createAutoDetectionResult(fields) {
  return {
    contentType:     fields.contentType,
    contentId:       fields.contentId,
    queueItemId:     fields.queueItemId     ?? null,
    detectionMethod: fields.detectionMethod,
    detectionSource: fields.detectionSource,
    category:        fields.category        ?? null,
    confidenceScore: fields.confidenceScore ?? null,
    matchedValue:    fields.matchedValue    ?? null,
    isActionable:    fields.isActionable    ?? false,
    metadata:        fields.metadata        ?? null,
    ruleId:          fields.ruleId          ?? null,
    createdAt:       Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("auto_detection_results").withConverter(autoDetectionResultConverter)
 */
export const autoDetectionResultConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      contentType:     data.contentType,
      contentId:       data.contentId,
      queueItemId:     data.queueItemId     ?? null,
      detectionMethod: data.detectionMethod,
      detectionSource: data.detectionSource,
      category:        data.category        ?? null,
      confidenceScore: data.confidenceScore ?? null,
      matchedValue:    data.matchedValue    ?? null,
      isActionable:    data.isActionable,
      metadata:        data.metadata        ?? null,
      ruleId:          data.ruleId          ?? null,
      createdAt:       data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - auto_detection_results.contentType  ASC
 *     auto_detection_results.contentId    ASC
 *     — "All detection results for this content."
 *
 * Single-field:
 *   - auto_detection_results.queueItemId      ASC  — "All detections linked to this queue item."
 *   - auto_detection_results.detectionMethod   ASC  — "All ML classifier results."
 *   - auto_detection_results.detectionSource   ASC  — "All Perspective API results."
 *   - auto_detection_results.isActionable      ASC  — "All actionable detections."
 *   - auto_detection_results.createdAt         ASC  — Time-range queries and metrics.
 */
