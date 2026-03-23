// post_slug_history: Historical slug records for redirect support after slug changes.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const postSlugHistorySchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  slug: { type: String, required: true },
changed_at: { type: Date, required: true, default: Date.now },
});
postSlugHistorySchema.index({ slug: 1 }, { unique: true });
postSlugHistorySchema.index({ post_id: 1 });
module.exports = mongoose.model("PostSlugHistory", postSlugHistorySchema);
