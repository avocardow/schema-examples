// series: Named collections for grouping related posts in ordered sequences.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const seriesSchema = new mongoose.Schema(
  {
title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: null },
    cover_image_url: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
seriesSchema.index({ slug: 1 }, { unique: true });
seriesSchema.index({ is_active: 1 });
module.exports = mongoose.model("Series", seriesSchema);
