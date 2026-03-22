// user_restrictions: Active restrictions on user accounts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const userRestrictionsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restriction_type: {
      type: String,
      enum: ["ban", "mute", "post_restriction", "shadow_ban", "warning", "probation"],
      required: true,
    },
    scope: {
      type: String,
      enum: ["global", "community", "channel"],
      required: true,
      default: "global",
    },
    scope_id: { type: String, default: null }, // Community/channel ID. Null when scope = global.
    reason: { type: String, default: null },
    moderation_action_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationAction",
      default: null,
    },
    imposed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imposed_at: { type: Date, required: true, default: Date.now },
    expires_at: { type: Date, default: null }, // Null = permanent.
    is_active: { type: Boolean, required: true, default: true },
    lifted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lifted_at: { type: Date, default: null }, // Null = still active or expired naturally.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
userRestrictionsSchema.index({ user_id: 1, is_active: 1 });
userRestrictionsSchema.index({ restriction_type: 1 });
userRestrictionsSchema.index({ scope: 1, scope_id: 1 });
userRestrictionsSchema.index({ expires_at: 1, is_active: 1 });
userRestrictionsSchema.index({ imposed_by: 1 });

module.exports = mongoose.model("UserRestriction", userRestrictionsSchema);
