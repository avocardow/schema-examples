// task_labels: Many-to-many mapping between tasks and labels.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taskLabelsSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    label_id: { type: mongoose.Schema.Types.ObjectId, ref: "Label", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

taskLabelsSchema.index({ task_id: 1, label_id: 1 }, { unique: true });
taskLabelsSchema.index({ label_id: 1 });

module.exports = mongoose.model("TaskLabel", taskLabelsSchema);
