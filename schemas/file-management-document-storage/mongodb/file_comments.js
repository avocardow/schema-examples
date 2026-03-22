// file_comments: Threaded comments on files — supports nested replies via parent_id self-reference and resolved state for review workflows.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileCommentsSchema = new mongoose.Schema(
  {
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
      // The file being commented on. Cascade: deleting a file removes all its comments.
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "FileComment" },
      // Parent comment for threaded replies. Null = top-level comment. Cascade: deleting a parent removes all its replies.
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      // Who wrote this comment.
    body: { type: String, required: true }, // Comment text. Supports plain text or markdown.
    is_resolved: { type: Boolean, required: true, default: false }, // Whether this comment thread is resolved.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

fileCommentsSchema.index({ file_id: 1, created_at: 1 });
fileCommentsSchema.index({ parent_id: 1 });
fileCommentsSchema.index({ author_id: 1 });

module.exports = mongoose.model("FileComment", fileCommentsSchema);
