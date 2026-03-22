// moderation_rules: Configurable auto-moderation rules.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const moderationRulesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Human-readable rule name.
    description: { type: String, default: null }, // What this rule does and why.
    scope: {
      type: String,
      enum: ["global", "community", "channel"],
      required: true,
      default: "global",
    },
    scope_id: { type: String, default: null }, // Community/channel ID. Null when scope = global.
    trigger_type: {
      type: String,
      enum: [
        "keyword",
        "regex",
        "ml_score",
        "hash_match",
        "mention_spam",
        "user_attribute",
      ],
      required: true,
    },
    trigger_config: { type: mongoose.Schema.Types.Mixed, required: true }, // Trigger-specific configuration (JSON).
    action_type: {
      type: String,
      enum: ["block", "flag", "hold", "timeout", "notify"],
      required: true,
    },
    action_config: { type: mongoose.Schema.Types.Mixed, default: {} }, // Action-specific parameters (JSON).
    priority: { type: Number, required: true, default: 0 }, // Higher = evaluated first. First match wins.
    is_enabled: { type: Boolean, required: true, default: true },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
moderationRulesSchema.index({ scope: 1, scope_id: 1, is_enabled: 1 });
moderationRulesSchema.index({ trigger_type: 1 });
moderationRulesSchema.index({ is_enabled: 1, priority: 1 });

module.exports = mongoose.model("ModerationRule", moderationRulesSchema);
