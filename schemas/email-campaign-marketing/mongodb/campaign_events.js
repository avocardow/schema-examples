// campaign_events: Records engagement events (opens, clicks, bounces) for sent emails.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const campaignEventSchema = new mongoose.Schema(
  {
    send_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampaignSend",
      required: true,
    },
    event_type: {
      type: String,
      enum: ["open", "click", "bounce", "complaint", "unsubscribe"],
      required: true,
    },
    link_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampaignLink",
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    occurred_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

campaignEventSchema.index({ send_id: 1 });
campaignEventSchema.index({ event_type: 1 });
campaignEventSchema.index({ occurred_at: 1 });

module.exports = mongoose.model("CampaignEvent", campaignEventSchema);
