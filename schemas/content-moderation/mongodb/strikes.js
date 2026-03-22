// strikes: Accumulated violations with configurable expiry.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const strikesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moderation_action_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationAction",
      required: true,
    },
    violation_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViolationCategory",
      default: null,
    },
    severity: {
      type: String,
      enum: ["minor", "moderate", "severe"],
      required: true,
      default: "moderate",
    },
    issued_at: { type: Date, required: true, default: Date.now },
    expires_at: { type: Date, default: null }, // Null = never expires.
    is_active: { type: Boolean, required: true, default: true },
    resolution: {
      type: String,
      enum: ["active", "expired", "appealed_overturned"],
      required: true,
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
strikesSchema.index({ user_id: 1, is_active: 1 });
strikesSchema.index({ moderation_action_id: 1 });
strikesSchema.index({ violation_category_id: 1 });
strikesSchema.index({ expires_at: 1, is_active: 1 });
strikesSchema.index({ resolution: 1 });

module.exports = mongoose.model("Strike", strikesSchema);
