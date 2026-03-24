// provider_services: Links providers to the services they offer with optional custom pricing.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const providerServicesSchema = new mongoose.Schema(
  {
    provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    custom_price: { type: Number, default: null },
    custom_duration: { type: Number, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

providerServicesSchema.index({ provider_id: 1, service_id: 1 }, { unique: true });
providerServicesSchema.index({ service_id: 1 });

module.exports = mongoose.model("ProviderService", providerServicesSchema);
