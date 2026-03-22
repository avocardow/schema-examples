// notification_workflow_runs: Execution instances of a workflow. Tracks state, progress, and errors for each run.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationWorkflowRunsSchema = new mongoose.Schema(
  {
    workflow_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationWorkflow", required: true },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationEvent", required: true },

    // Execution lifecycle.
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed", "canceled"],
      required: true,
      default: "pending",
    },

    current_step_order: { type: Number }, // Which step the workflow is currently on (or last completed).

    // Error details if the run failed.
    error_message: { type: String },
    error_step_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationWorkflowStep" }, // Which step caused the failure.

    started_at: { type: Date },    // When execution began.
    completed_at: { type: Date },  // When execution finished (success or failure).
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationWorkflowRunsSchema.index({ workflow_id: 1, status: 1 }); // All failed runs for this workflow (monitoring dashboard).
notificationWorkflowRunsSchema.index({ event_id: 1 });               // Workflow run for this event.
notificationWorkflowRunsSchema.index({ status: 1, created_at: 1 });  // All pending runs (for the workflow executor to pick up).
notificationWorkflowRunsSchema.index({ created_at: 1 });             // Time-range queries and retention cleanup.

module.exports = mongoose.model("NotificationWorkflowRun", notificationWorkflowRunsSchema);
