// reports: User-submitted content reports.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const reportsSchema = new mongoose.Schema(
  {
    reporter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content_type: {
      type: String,
      enum: ["post", "comment", "message", "user", "media"],
      required: true,
    },
    content_id: {
      type: String,
      required: true,
    },
    queue_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationQueueItem",
      default: null,
    },
    category: {
      type: String,
      enum: [
        "spam",
        "harassment",
        "hate_speech",
        "violence",
        "sexual_content",
        "illegal",
        "misinformation",
        "self_harm",
        "other",
      ],
      required: true,
    },
    reason_text: {
      type: String,
      default: null,
    },
    policy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationPolicy",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
reportsSchema.index({ queue_item_id: 1 });
reportsSchema.index({ reporter_id: 1 });
reportsSchema.index({ content_type: 1, content_id: 1 });
reportsSchema.index({ status: 1 });
reportsSchema.index({ category: 1 });
reportsSchema.index({ created_at: 1 });

module.exports = mongoose.model("Report", reportsSchema);
