// auto_detection_results: Automated content analysis results.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const autoDetectionResultsSchema = new mongoose.Schema(
  {
    content_type: {
      type: String,
      enum: ["post", "comment", "message", "user", "media"],
      required: true,
    },
    content_id: { type: String, required: true },

    queue_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationQueueItem",
      default: null,
    },

    detection_method: {
      type: String,
      enum: ["ml_classifier", "hash_match", "keyword", "regex", "blocklist"],
      required: true,
    },
    detection_source: { type: String, required: true },

    category: { type: String, default: null },
    confidence_score: { type: Number, default: null },
    matched_value: { type: String, default: null },

    is_actionable: { type: Boolean, required: true, default: false },

    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

    rule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationRule",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

autoDetectionResultsSchema.index({ content_type: 1, content_id: 1 });
autoDetectionResultsSchema.index({ queue_item_id: 1 });
autoDetectionResultsSchema.index({ detection_method: 1 });
autoDetectionResultsSchema.index({ detection_source: 1 });
autoDetectionResultsSchema.index({ is_actionable: 1 });
autoDetectionResultsSchema.index({ created_at: 1 });

module.exports = mongoose.model("AutoDetectionResult", autoDetectionResultsSchema);
