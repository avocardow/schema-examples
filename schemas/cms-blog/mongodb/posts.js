// posts: Core content entries supporting posts and pages with publishing workflow.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const postsSchema = new mongoose.Schema(
  {
type: { type: String, enum: ["post", "page"], required: true, default: "post" },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    excerpt: { type: String, default: null },
    content: { type: String, default: null },
    featured_image_url: { type: String, default: null },
    status: { type: String, enum: ["draft", "scheduled", "published", "archived"], required: true, default: "draft" },
    visibility: { type: String, enum: ["public", "private", "password_protected"], required: true, default: "public" },
    password: { type: String, default: null },
    is_featured: { type: Boolean, required: true, default: false },
    allow_comments: { type: Boolean, required: true, default: true },
    meta_title: { type: String, default: null },
    meta_description: { type: String, default: null },
    og_image_url: { type: String, default: null },
    published_at: { type: Date, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
postsSchema.index({ slug: 1 }, { unique: true });
postsSchema.index({ status: 1, published_at: 1 });
postsSchema.index({ type: 1, status: 1 });
postsSchema.index({ created_by: 1 });
postsSchema.index({ is_featured: 1 });
module.exports = mongoose.model("Post", postsSchema);
