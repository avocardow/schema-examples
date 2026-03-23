// post_authors: Junction table linking posts to authors with roles.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const postAuthorsSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  sort_order: { type: Number, required: true, default: 0 },
  role: { type: String, enum: ["author", "contributor", "editor", "guest"], required: true, default: "author" },
});
postAuthorsSchema.index({ post_id: 1, author_id: 1 }, { unique: true });
postAuthorsSchema.index({ author_id: 1 });
module.exports = mongoose.model("PostAuthor", postAuthorsSchema);
