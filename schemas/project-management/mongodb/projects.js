// projects: Top-level project containers with metadata and visibility settings.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    key: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    icon: { type: String, default: null },
    color: { type: String, default: null },
    visibility: {
      type: String,
      enum: ["public", "private"],
      required: true,
      default: "public",
    },
    task_count: { type: Number, required: true, default: 0 },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

projectsSchema.index({ created_by: 1 });

module.exports = mongoose.model("Project", projectsSchema);
