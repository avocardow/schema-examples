// webhook_endpoint_event_types: Maps which event types each webhook endpoint subscribes to.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const webhookEndpointEventTypeSchema = new mongoose.Schema(
  {
    endpoint_id: { type: mongoose.Schema.Types.ObjectId, ref: "WebhookEndpoint", required: true },
    event_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "WebhookEventType", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

webhookEndpointEventTypeSchema.index({ endpoint_id: 1, event_type_id: 1 }, { unique: true });
webhookEndpointEventTypeSchema.index({ event_type_id: 1 });

module.exports = mongoose.model("WebhookEndpointEventType", webhookEndpointEventTypeSchema);
