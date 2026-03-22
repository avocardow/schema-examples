// user_moderation_notes: Internal moderator notes on user accounts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const userModerationNotesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      // The user this note is about.
      // Cascade: deleting a user removes all their notes.
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      // The moderator who wrote this note.
      // Restrict: don't delete moderators who have notes.
    body: { type: String, required: true },
      // The note text. Internal-only, never shown to the user.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
userModerationNotesSchema.index({ user_id: 1 }); // "All notes for this user."
userModerationNotesSchema.index({ author_id: 1 }); // "All notes by this moderator."

module.exports = mongoose.model("UserModerationNote", userModerationNotesSchema);
