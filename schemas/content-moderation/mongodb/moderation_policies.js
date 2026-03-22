// moderation_policies: Community/platform rule definitions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const moderationPoliciesSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["global", "community", "channel"],
      required: true,
      default: "global",
    },
    scope_id: { type: String, default: null }, // ID of the community/channel. Null when scope = global.
    title: { type: String, required: true }, // Short policy title (e.g., "No Hate Speech").
    description: { type: String, required: true }, // Full policy text explaining what's prohibited and why.
    violation_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViolationCategory",
      default: null,
    }, // Which violation category this policy maps to.
    sort_order: { type: Number, required: true, default: 0 }, // Display ordering within the scope.
    is_active: { type: Boolean, required: true, default: true }, // Soft-disable without deleting.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
moderationPoliciesSchema.index({ scope: 1, scope_id: 1 });
moderationPoliciesSchema.index({ violation_category_id: 1 });
moderationPoliciesSchema.index({ is_active: 1 });

module.exports = mongoose.model("ModerationPolicy", moderationPoliciesSchema);
