// post_categories: Junction table linking posts to categories.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const postCategoriesSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
});
postCategoriesSchema.index({ post_id: 1, category_id: 1 }, { unique: true });
postCategoriesSchema.index({ category_id: 1 });
module.exports = mongoose.model("PostCategory", postCategoriesSchema);
