// redirects: URL redirect rules for SEO and link management.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const redirectsSchema = new mongoose.Schema(
  {
source_path: { type: String, required: true },
    target_path: { type: String, required: true },
    status_code: { type: Number, required: true, default: 301 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
redirectsSchema.index({ source_path: 1 }, { unique: true });
redirectsSchema.index({ is_active: 1 });
module.exports = mongoose.model("Redirect", redirectsSchema);
