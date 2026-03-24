// task_lists: Ordered groupings of tasks within a project.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taskListsSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

taskListsSchema.index({ project_id: 1, position: 1 });

module.exports = mongoose.model("TaskList", taskListsSchema);
