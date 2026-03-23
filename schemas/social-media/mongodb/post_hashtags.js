// post_hashtags: Links posts to their associated hashtags.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const postHashtagsSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    hashtag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hashtag", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

postHashtagsSchema.index({ post_id: 1, hashtag_id: 1 }, { unique: true });
postHashtagsSchema.index({ hashtag_id: 1, created_at: 1 });

module.exports = mongoose.model("PostHashtag", postHashtagsSchema);
