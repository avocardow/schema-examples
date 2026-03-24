// task_comments: Threaded discussion comments on tasks.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taskCommentsSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "TaskComment", default: null },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

taskCommentsSchema.index({ task_id: 1 });
taskCommentsSchema.index({ parent_id: 1 });
taskCommentsSchema.index({ user_id: 1 });

module.exports = mongoose.model("TaskComment", taskCommentsSchema);
