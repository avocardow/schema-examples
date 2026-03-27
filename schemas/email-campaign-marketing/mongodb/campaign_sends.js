// campaign_sends: Tracks individual email delivery status per contact per campaign.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const campaignSendSchema = new mongoose.Schema(
  {
    campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    status: {
      type: String,
      enum: ["queued", "sent", "delivered", "bounced", "dropped", "deferred"],
      required: true,
      default: "queued",
    },
    sent_at: {
      type: Date,
      default: null,
    },
    delivered_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

campaignSendSchema.index({ campaign_id: 1, contact_id: 1 }, { unique: true });
campaignSendSchema.index({ contact_id: 1 });
campaignSendSchema.index({ status: 1 });
campaignSendSchema.index({ sent_at: 1 });

module.exports = mongoose.model("CampaignSend", campaignSendSchema);
