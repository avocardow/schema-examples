// post_revisions: Versioned snapshots of post content for revision history.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const postRevisionsSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    revision_number: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, default: null },
    excerpt: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
postRevisionsSchema.index({ post_id: 1, revision_number: 1 }, { unique: true });
postRevisionsSchema.index({ post_id: 1, created_at: 1 });
module.exports = mongoose.model("PostRevision", postRevisionsSchema);
