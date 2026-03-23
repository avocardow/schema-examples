// tags: Flat content tags for flexible post classification.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const tagsSchema = new mongoose.Schema(
  {
name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
tagsSchema.index({ slug: 1 }, { unique: true });
tagsSchema.index({ is_active: 1 });
module.exports = mongoose.model("Tag", tagsSchema);
