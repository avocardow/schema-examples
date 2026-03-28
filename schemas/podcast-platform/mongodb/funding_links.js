// funding_links: Donation and support links attached to podcast shows.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const fundingLinksSchema = new mongoose.Schema(
  {
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    position: { type: Number, default: 0, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

fundingLinksSchema.index({ show_id: 1, position: 1 });

module.exports = mongoose.model("FundingLink", fundingLinksSchema);
