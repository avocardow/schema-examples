// clicks: Tracks individual clicks on affiliate links with device and geo data.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    affiliate_link_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliateLink",
      required: true,
    },
    click_id: { type: String, required: true, unique: true },
    ip_address: { type: String, default: null },
    user_agent: { type: String, default: null },
    referer_url: { type: String, default: null },
    landing_url: { type: String, default: null },
    country: { type: String, default: null },
    device_type: { type: String, default: null },
    is_unique: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

clickSchema.index({ affiliate_link_id: 1, created_at: 1 });
clickSchema.index({ created_at: 1 });

module.exports = mongoose.model("Click", clickSchema);
