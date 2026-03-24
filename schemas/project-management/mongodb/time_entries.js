// time_entries: Tracked time spent on tasks by users.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const timeEntriesSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, default: null },
    start_time: { type: Date, default: null },
    end_time: { type: Date, default: null },
    duration: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

timeEntriesSchema.index({ task_id: 1 });
timeEntriesSchema.index({ user_id: 1, start_time: 1 });

module.exports = mongoose.model("TimeEntry", timeEntriesSchema);
