// keyword_lists: Managed word/phrase lists for auto-moderation.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const keywordListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // List name (e.g., "Profanity — English", "Competitor URLs").
    description: { type: String, default: null }, // What this list contains and how it's used.

    // blocklist = content matching these entries is blocked/flagged.
    // allowlist = entries that override blocklist matches.
    // watchlist = entries that flag content for review.
    list_type: {
      type: String,
      enum: ["blocklist", "allowlist", "watchlist"],
      required: true,
    },

    scope: {
      type: String,
      enum: ["global", "community"],
      required: true,
      default: "global",
    },
    scope_id: { type: String, default: null }, // Community ID. Null when scope = global.

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
keywordListSchema.index({ scope: 1, scope_id: 1 }); // "All keyword lists for this community."
keywordListSchema.index({ list_type: 1 }); // "All blocklists."
keywordListSchema.index({ is_enabled: 1 }); // "All active lists."

module.exports = mongoose.model("KeywordList", keywordListSchema);
