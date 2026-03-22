// experiment_goals: Links experiments to their target conversion goals.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const experimentGoalsSchema = new mongoose.Schema(
  {
    experiment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
    goal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
    is_primary: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

experimentGoalsSchema.index({ experiment_id: 1, goal_id: 1 }, { unique: true });
experimentGoalsSchema.index({ goal_id: 1 });

module.exports = mongoose.model("ExperimentGoal", experimentGoalsSchema);
