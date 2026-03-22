// appeals: User appeals against moderation actions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const appealsSchema = new mongoose.Schema(
  {
    moderation_action_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationAction",
      required: true,
    },
    appellant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appeal_text: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewer_notes: { type: String, default: null },
    reviewed_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
appealsSchema.index({ moderation_action_id: 1 }, { unique: true, sparse: true });
appealsSchema.index({ appellant_id: 1 });
appealsSchema.index({ status: 1 });
appealsSchema.index({ reviewer_id: 1 });
appealsSchema.index({ created_at: 1 });

module.exports = mongoose.model("Appeal", appealsSchema);
