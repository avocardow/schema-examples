// experiment_assignments: Records which users or visitors are assigned to which experiment variant.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const experimentAssignmentsSchema = new mongoose.Schema(
  {
    experiment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ExperimentVariant", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    anonymous_id: { type: String, default: null },
    assigned_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

experimentAssignmentsSchema.index({ experiment_id: 1, user_id: 1 }, { unique: true, sparse: true });
experimentAssignmentsSchema.index({ experiment_id: 1, variant_id: 1 });
experimentAssignmentsSchema.index({ user_id: 1 });
experimentAssignmentsSchema.index({ assigned_at: 1 });

module.exports = mongoose.model("ExperimentAssignment", experimentAssignmentsSchema);
