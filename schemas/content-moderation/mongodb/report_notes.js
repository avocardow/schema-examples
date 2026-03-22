// report_notes: Internal moderator notes on queue items.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const reportNotesSchema = new mongoose.Schema(
  {
    queue_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationQueueItem",
      required: true,
    },
      // The queue item this note is attached to.
      // Cascade: deleting a queue item removes all its notes.
    moderator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      // Who wrote this note.
      // Restrict: don't delete moderators who have notes.
    content: { type: String, required: true },
      // The note text. Internal-only, never shown to the reported user.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
reportNotesSchema.index({ queue_item_id: 1 }); // "All notes for this queue item."
reportNotesSchema.index({ moderator_id: 1 }); // "All notes by this moderator."

module.exports = mongoose.model("ReportNote", reportNotesSchema);
