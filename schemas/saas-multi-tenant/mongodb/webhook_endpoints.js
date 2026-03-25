// webhook_endpoints: Registered webhook URLs per organization with delivery tracking.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const webhookEndpointSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    url: { type: String, required: true },
    description: { type: String, default: null },
    signing_secret: { type: String, required: true },
    status: { type: String, enum: ["active", "paused", "disabled"], required: true, default: "active" },
    failure_count: { type: Number, required: true, default: 0 },
    last_success_at: { type: Date, default: null },
    last_failure_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

webhookEndpointSchema.index({ organization_id: 1 });
webhookEndpointSchema.index({ status: 1 });

module.exports = mongoose.model("WebhookEndpoint", webhookEndpointSchema);
