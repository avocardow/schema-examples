// comments: Threaded discussion comments on assets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    body: { type: String, required: true },
    author_id: {
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
commentSchema.index({ asset_id: 1 });
commentSchema.index({ parent_id: 1 });

module.exports = mongoose.model("Comment", commentSchema);
