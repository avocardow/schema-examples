// import_export_jobs: Tracks bulk import and export operations with progress and error details.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const importExportJobsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["import", "export"],
      required: true,
    },
    format: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      required: true,
      default: "pending",
    },
    locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale" },
    namespace_id: { type: mongoose.Schema.Types.ObjectId, ref: "Namespace" },
    file_path: { type: String },
    total_count: { type: Number, required: true, default: 0 },
    processed_count: { type: Number, required: true, default: 0 },
    error_message: { type: String },
    options: { type: mongoose.Schema.Types.Mixed },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    started_at: { type: Date },
    completed_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

importExportJobsSchema.index({ status: 1 });
importExportJobsSchema.index({ created_by: 1 });
importExportJobsSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model("ImportExportJob", importExportJobsSchema);
