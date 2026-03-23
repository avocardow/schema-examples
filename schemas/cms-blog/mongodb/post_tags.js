// post_tags: Junction table linking posts to tags with ordering.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const postTagsSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true },
  sort_order: { type: Number, required: true, default: 0 },
});
postTagsSchema.index({ post_id: 1, tag_id: 1 }, { unique: true });
postTagsSchema.index({ tag_id: 1 });
module.exports = mongoose.model("PostTag", postTagsSchema);
