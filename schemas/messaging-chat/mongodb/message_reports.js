// message_reports: tracks user-submitted reports against messages, supporting moderation workflows.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const messageReportSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    reporter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: ["spam", "harassment", "hate_speech", "violence", "misinformation", "nsfw", "other"],
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      required: true,
      default: "pending",
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewed_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Composite unique: one report per reporter per message
messageReportSchema.index({ message_id: 1, reporter_id: 1 }, { unique: true });

// message_id is covered by the composite unique index above
messageReportSchema.index({ reporter_id: 1 });
messageReportSchema.index({ status: 1 });
messageReportSchema.index({ reviewed_by: 1 });

const MessageReport = mongoose.model("MessageReport", messageReportSchema);

module.exports = MessageReport;
