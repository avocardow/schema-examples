// usage_events: Tracks metered feature consumption per organization.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const usageEventSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    feature_id: { type: mongoose.Schema.Types.ObjectId, ref: "Feature", required: true },
    quantity: { type: Number, required: true, default: 1 },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    idempotency_key: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

usageEventSchema.index({ organization_id: 1, feature_id: 1, created_at: 1 });
usageEventSchema.index({ idempotency_key: 1 });

module.exports = mongoose.model("UsageEvent", usageEventSchema);
