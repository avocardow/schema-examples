// webhook_delivery_attempts: Tracks each delivery attempt for a webhook message to an endpoint.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const webhookDeliveryAttemptSchema = new mongoose.Schema(
  {
    message_id: { type: mongoose.Schema.Types.ObjectId, ref: "WebhookMessage", required: true },
    endpoint_id: { type: mongoose.Schema.Types.ObjectId, ref: "WebhookEndpoint", required: true },
    attempt_number: { type: Number, required: true, default: 1 },
    status: { type: String, enum: ["pending", "success", "failed"], required: true, default: "pending" },
    http_status: { type: Number, default: null },
    response_body: { type: String, default: null },
    error_message: { type: String, default: null },
    attempted_at: { type: Date, default: null },
    duration_ms: { type: Number, default: null },
    next_retry_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

webhookDeliveryAttemptSchema.index({ message_id: 1, attempt_number: 1 });
webhookDeliveryAttemptSchema.index({ endpoint_id: 1, created_at: 1 });
webhookDeliveryAttemptSchema.index({ status: 1, next_retry_at: 1 });

module.exports = mongoose.model("WebhookDeliveryAttempt", webhookDeliveryAttemptSchema);
