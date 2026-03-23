// hashtags: Stores unique hashtag names and their usage counts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const hashtagsSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    post_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

hashtagsSchema.index({ post_count: 1 });

module.exports = mongoose.model("Hashtag", hashtagsSchema);
