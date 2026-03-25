// webhook_messages: Stores inbound/outbound webhook event payloads per organization.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const webhookMessageSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    event_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "WebhookEventType", required: true },
    event_id: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

webhookMessageSchema.index({ organization_id: 1, created_at: 1 });
webhookMessageSchema.index({ event_type_id: 1 });
webhookMessageSchema.index({ event_id: 1 });

module.exports = mongoose.model("WebhookMessage", webhookMessageSchema);
