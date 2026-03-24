// tasks: Core work items with type, priority, status, and hierarchical support.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    task_list_id: { type: mongoose.Schema.Types.ObjectId, ref: "TaskList", default: null },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
    status_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectStatus", default: null },
    milestone_id: { type: mongoose.Schema.Types.ObjectId, ref: "Milestone", default: null },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    type: {
      type: String,
      enum: ["task", "bug", "story", "epic"],
      required: true,
      default: "task",
    },
    priority: {
      type: String,
      enum: ["none", "urgent", "high", "medium", "low"],
      required: true,
      default: "none",
    },
    due_date: { type: String, default: null },
    start_date: { type: String, default: null },
    estimate_points: { type: Number, default: null },
    position: { type: Number, required: true, default: 0 },
    completed_at: { type: Date, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tasksSchema.index({ project_id: 1, number: 1 }, { unique: true });
tasksSchema.index({ project_id: 1, status_id: 1 });
tasksSchema.index({ task_list_id: 1, position: 1 });
tasksSchema.index({ parent_id: 1 });
tasksSchema.index({ milestone_id: 1 });
tasksSchema.index({ type: 1 });
tasksSchema.index({ due_date: 1 });
tasksSchema.index({ created_by: 1 });

module.exports = mongoose.model("Task", tasksSchema);
