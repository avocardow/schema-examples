// series_items: Junction table linking posts to series with ordering.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const seriesItemsSchema = new mongoose.Schema({
  series_id: { type: mongoose.Schema.Types.ObjectId, ref: "Series", required: true },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  sort_order: { type: Number, required: true, default: 0 },
});
seriesItemsSchema.index({ series_id: 1, post_id: 1 }, { unique: true });
seriesItemsSchema.index({ post_id: 1 });
seriesItemsSchema.index({ series_id: 1, sort_order: 1 });
module.exports = mongoose.model("SeriesItem", seriesItemsSchema);
