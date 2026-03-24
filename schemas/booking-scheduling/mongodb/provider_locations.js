// provider_locations: Maps providers to the locations where they work.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const providerLocationsSchema = new mongoose.Schema(
  {
    provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    is_primary: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

providerLocationsSchema.index({ provider_id: 1, location_id: 1 }, { unique: true });
providerLocationsSchema.index({ location_id: 1 });

module.exports = mongoose.model("ProviderLocation", providerLocationsSchema);
