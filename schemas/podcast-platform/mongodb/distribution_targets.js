// distribution_targets: Distribution platform targets for podcast shows, tracking submission and approval status.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const distribution_targetsSchema = new mongoose.Schema(
  {
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    platform: { type: String, required: true },
    external_id: { type: String, default: null },
    status: { type: String, enum: ["pending", "active", "rejected", "suspended"], required: true, default: "pending" },
    feed_url_override: { type: String, default: null },
    submitted_at: { type: Date, default: null },
    approved_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

distribution_targetsSchema.index({ show_id: 1, platform: 1 });
distribution_targetsSchema.index({ status: 1 });

module.exports = mongoose.model("DistributionTarget", distribution_targetsSchema);
