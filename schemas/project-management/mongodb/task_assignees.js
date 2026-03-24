// task_assignees: Links users to tasks with assignee or reviewer roles.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taskAssigneesSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["assignee", "reviewer"],
      required: true,
      default: "assignee",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

taskAssigneesSchema.index({ task_id: 1, user_id: 1 }, { unique: true });
taskAssigneesSchema.index({ user_id: 1 });

module.exports = mongoose.model("TaskAssignee", taskAssigneesSchema);
