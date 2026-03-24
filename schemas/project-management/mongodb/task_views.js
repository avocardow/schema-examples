// task_views: Saved view configurations with layout, filters, and sorting options.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taskViewsSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    layout: {
      type: String,
      enum: ["list", "board", "calendar", "timeline"],
      required: true,
      default: "list",
    },
    filters: { type: mongoose.Schema.Types.Mixed, default: null },
    sort_by: { type: mongoose.Schema.Types.Mixed, default: null },
    group_by: { type: String, default: null },
    is_shared: { type: Boolean, required: true, default: false },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

taskViewsSchema.index({ project_id: 1, position: 1 });
taskViewsSchema.index({ created_by: 1 });

module.exports = mongoose.model("TaskView", taskViewsSchema);
