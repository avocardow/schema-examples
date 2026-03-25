// provider_webhook_events: Raw webhook event log from payment providers.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const providerWebhookEventsSchema = new mongoose.Schema(
  {
    provider_type: { type: String, required: true },
    provider_event_id: { type: String, required: true },
    event_type: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    processed_at: { type: Date, default: null },
    processing_error: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

providerWebhookEventsSchema.index({ provider_type: 1, provider_event_id: 1 }, { unique: true });
providerWebhookEventsSchema.index({ event_type: 1 });
providerWebhookEventsSchema.index({ processed_at: 1 });

module.exports = mongoose.model("ProviderWebhookEvent", providerWebhookEventsSchema);
