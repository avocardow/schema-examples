// kb_articles: Self-service knowledge base content for customers and agents.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const kbArticlesSchema = new mongoose.Schema(
  {
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "KbCategory", default: null },
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      required: true,
      default: "draft",
    },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    view_count: { type: Number, required: true, default: 0 },
    helpful_count: { type: Number, required: true, default: 0 },
    not_helpful_count: { type: Number, required: true, default: 0 },
    published_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

kbArticlesSchema.index({ category_id: 1 });
kbArticlesSchema.index({ status: 1 });
kbArticlesSchema.index({ author_id: 1 });

module.exports = mongoose.model("KbArticle", kbArticlesSchema);
