// task_activities: Audit log of all changes and actions performed on tasks.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taskActivitiesSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    action: {
      type: String,
      enum: [
        "created",
        "updated",
        "commented",
        "assigned",
        "unassigned",
        "labeled",
        "unlabeled",
        "moved",
        "archived",
        "restored",
      ],
      required: true,
    },
    field: { type: String, default: null },
    old_value: { type: String, default: null },
    new_value: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

taskActivitiesSchema.index({ task_id: 1, created_at: 1 });
taskActivitiesSchema.index({ user_id: 1 });

module.exports = mongoose.model("TaskActivity", taskActivitiesSchema);
