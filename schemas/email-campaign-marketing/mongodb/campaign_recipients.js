// campaign_recipients: Links campaigns to target lists and segments.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const campaignRecipientSchema = new mongoose.Schema(
  {
    campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactList",
      default: null,
    },
    segment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Segment",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

campaignRecipientSchema.index({ campaign_id: 1 });
campaignRecipientSchema.index({ list_id: 1 });
campaignRecipientSchema.index({ segment_id: 1 });

module.exports = mongoose.model("CampaignRecipient", campaignRecipientSchema);
