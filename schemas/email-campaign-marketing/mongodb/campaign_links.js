// campaign_links: Tracked URLs within campaign emails.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const campaignLinkSchema = new mongoose.Schema(
  {
    campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    original_url: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

campaignLinkSchema.index({ campaign_id: 1, original_url: 1 }, { unique: true });

module.exports = mongoose.model("CampaignLink", campaignLinkSchema);
