// campaigns: Email campaigns with scheduling, A/B testing, and delivery tracking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: null,
    },
    from_name: {
      type: String,
      default: null,
    },
    from_email: {
      type: String,
      default: null,
    },
    reply_to: {
      type: String,
      default: null,
    },
    template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
    html_body: {
      type: String,
      default: null,
    },
    text_body: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "paused", "cancelled", "sent"],
      required: true,
      default: "draft",
    },
    campaign_type: {
      type: String,
      enum: ["regular", "ab_test"],
      required: true,
      default: "regular",
    },
    scheduled_at: {
      type: Date,
      default: null,
    },
    sent_at: {
      type: Date,
      default: null,
    },
    ab_test_winner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
    },
    ab_test_sample_pct: {
      type: Number,
      default: null,
    },
    ab_test_metric: {
      type: String,
      enum: ["open_rate", "click_rate"],
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

campaignSchema.index({ status: 1 });
campaignSchema.index({ campaign_type: 1 });
campaignSchema.index({ template_id: 1 });
campaignSchema.index({ scheduled_at: 1 });
campaignSchema.index({ created_at: 1 });

module.exports = mongoose.model("Campaign", campaignSchema);
