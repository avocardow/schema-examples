// file_tags: Tag definitions for organizing files with visibility levels (public, private, system).
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileTagsSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true }, // Tag name (e.g., "important", "reviewed", "needs-update").
    color: { type: String }, // Hex color for UI display (e.g., "#ff5733").

    // public = visible to all users.
    // private = visible only to the creator.
    // system = admin-managed, visible to all but only admins can assign.
    visibility: {
      type: String,
      enum: ["public", "private", "system"],
      required: true,
      default: "public",
    },

    description: { type: String }, // Explain what this tag means or when to use it.
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

fileTagsSchema.index({ visibility: 1 });

module.exports = mongoose.model("FileTag", fileTagsSchema);
