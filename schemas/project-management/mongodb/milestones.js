// milestones: Time-boxed project goals for grouping and tracking task progress.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const milestonesSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ["planned", "active", "completed", "cancelled"],
      required: true,
      default: "planned",
    },
    start_date: { type: String, default: null },
    end_date: { type: String, default: null },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

milestonesSchema.index({ project_id: 1, status: 1 });
milestonesSchema.index({ project_id: 1, position: 1 });

module.exports = mongoose.model("Milestone", milestonesSchema);
