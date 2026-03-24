// task_dependencies: Directed relationships between tasks for dependency tracking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taskDependenciesSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    depends_on_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    type: {
      type: String,
      enum: ["blocks", "is_blocked_by", "relates_to", "duplicates"],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

taskDependenciesSchema.index({ task_id: 1, depends_on_id: 1, type: 1 }, { unique: true });
taskDependenciesSchema.index({ depends_on_id: 1 });

module.exports = mongoose.model("TaskDependency", taskDependenciesSchema);
