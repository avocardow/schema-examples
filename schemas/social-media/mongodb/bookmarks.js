// bookmarks: Stores user-saved posts for later access.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bookmarksSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

bookmarksSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
bookmarksSchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("Bookmark", bookmarksSchema);
