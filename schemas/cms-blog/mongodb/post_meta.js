// post_meta: Flexible key-value metadata storage for posts.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const postMetaSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  meta_key: { type: String, required: true },
  meta_value: { type: String, default: null },
});
postMetaSchema.index({ post_id: 1, meta_key: 1 }, { unique: true });
postMetaSchema.index({ meta_key: 1 });
module.exports = mongoose.model("PostMeta", postMetaSchema);
