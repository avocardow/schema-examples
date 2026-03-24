// project_statuses: Configurable workflow statuses for each project.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const projectStatusesSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    color: { type: String, default: null },
    category: {
      type: String,
      enum: ["backlog", "unstarted", "started", "completed", "cancelled"],
      required: true,
    },
    position: { type: Number, required: true, default: 0 },
    is_default: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

projectStatusesSchema.index({ project_id: 1, position: 1 });
projectStatusesSchema.index({ project_id: 1, category: 1 });

module.exports = mongoose.model("ProjectStatus", projectStatusesSchema);
