// task_attachments: File attachments uploaded to tasks.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taskAttachmentsSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    file_name: { type: String, required: true },
    file_url: { type: String, required: true },
    file_size: { type: Number, default: null },
    mime_type: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

taskAttachmentsSchema.index({ task_id: 1 });
taskAttachmentsSchema.index({ uploaded_by: 1 });

module.exports = mongoose.model("TaskAttachment", taskAttachmentsSchema);
