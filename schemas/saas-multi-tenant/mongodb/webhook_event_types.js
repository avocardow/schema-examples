// webhook_event_types: Catalogue of event types that can trigger webhook deliveries.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const webhookEventTypeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    is_enabled: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

webhookEventTypeSchema.index({ is_enabled: 1 });

module.exports = mongoose.model("WebhookEventType", webhookEventTypeSchema);
