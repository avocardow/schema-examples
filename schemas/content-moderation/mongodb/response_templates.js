// response_templates: Pre-written response messages for moderator actions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const responseTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Internal template name (e.g., "Spam Removal — First Offense").
    action_type: {
      type: String,
      enum: ["approve", "remove", "warn", "mute", "ban", "restrict", "escalate", "label"],
      default: null,
    }, // Which moderation action this template is for. Null = usable with any action type.
    content: { type: String, required: true }, // Template text. May include placeholders like {{username}}, {{rule}}, {{appeal_url}}.
    violation_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViolationCategory",
      default: null,
    }, // Suggested violation category for this template.
    scope: {
      type: String,
      enum: ["global", "community"],
      required: true,
      default: "global",
    }, // global = available everywhere. community = specific to one community.
    scope_id: { type: String, default: null }, // Community ID. Null when scope = global.
    is_active: { type: Boolean, required: true, default: true },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Who created this template.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
responseTemplateSchema.index({ scope: 1, scope_id: 1 }); // "All templates for this community."
responseTemplateSchema.index({ action_type: 1 }); // "All templates for removal actions."
responseTemplateSchema.index({ violation_category_id: 1 }); // "All templates for hate speech violations."
responseTemplateSchema.index({ is_active: 1 }); // "All active templates."

module.exports = mongoose.model("ResponseTemplate", responseTemplateSchema);
