// schedules: Named availability schedules for providers.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const schedulesSchema = new mongoose.Schema(
  {
    provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    name: { type: String, required: true },
    timezone: { type: String, required: true },
    is_default: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schedulesSchema.index({ provider_id: 1, is_default: 1 });

module.exports = mongoose.model("Schedule", schedulesSchema);
