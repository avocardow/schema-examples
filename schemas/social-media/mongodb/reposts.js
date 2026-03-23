// reposts: Tracks when users repost content to their followers.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const repostsSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

repostsSchema.index({ post_id: 1, user_id: 1 }, { unique: true });
repostsSchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("Repost", repostsSchema);
