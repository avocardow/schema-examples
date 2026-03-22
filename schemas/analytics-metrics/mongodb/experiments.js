// experiments: A/B test experiments with status lifecycle and traffic allocation.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const experimentsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    hypothesis: { type: String, default: null },
    status: { type: String, enum: ["draft", "running", "paused", "completed"], required: true, default: "draft" },
    traffic_percentage: { type: Number, required: true, default: 1.0 },
    started_at: { type: Date, default: null },
    ended_at: { type: Date, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

experimentsSchema.index({ status: 1 });
experimentsSchema.index({ created_by: 1 });

module.exports = mongoose.model("Experiment", experimentsSchema);
