// moderation_queue_items: Central moderation queue for content review.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const moderationQueueItemsSchema = new mongoose.Schema(
  {
    content_type: {
      type: String,
      enum: ["post", "comment", "message", "user", "media"],
      required: true,
    },
    content_id: { type: String, required: true }, // ID of the flagged content. String, not ObjectId — supports external ID formats.
    source: {
      type: String,
      enum: ["user_report", "auto_detection", "manual"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_review", "resolved", "escalated"],
      required: true,
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
      default: "medium",
    },
    assigned_moderator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // Moderator currently reviewing this item.
    content_snapshot: { type: mongoose.Schema.Types.Mixed, default: null }, // Frozen copy of the content at time of flagging.
    report_count: { type: Number, required: true, default: 0 }, // Denormalized from reports table for queue sorting.
    resolution: {
      type: String,
      enum: ["approved", "removed", "escalated"],
      default: null,
    }, // Final outcome. Null = not yet resolved.
    resolved_at: { type: Date, default: null }, // When the item was resolved.
    resolved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // Moderator who resolved this item.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
moderationQueueItemsSchema.index({ status: 1, priority: 1, created_at: 1 });
moderationQueueItemsSchema.index({ content_type: 1, content_id: 1 });
moderationQueueItemsSchema.index({ assigned_moderator_id: 1 });
moderationQueueItemsSchema.index({ source: 1 });
moderationQueueItemsSchema.index({ resolved_at: 1 });

module.exports = mongoose.model("ModerationQueueItem", moderationQueueItemsSchema);
