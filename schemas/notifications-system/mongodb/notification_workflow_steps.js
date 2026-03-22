// notification_workflow_steps: Individual steps within a workflow, executing in ascending step_order.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const STEP_TYPE = ["channel", "delay", "digest", "condition", "throttle"];
const CHANNEL_TYPE = ["email", "sms", "push", "in_app", "chat", "webhook"];

const notificationWorkflowStepsSchema = new mongoose.Schema(
  {
    workflow_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationWorkflow", required: true },

    step_order: { type: Number, required: true }, // Execution order within the workflow.

    step_type: { type: String, enum: STEP_TYPE, required: true },

    channel_type: { type: String, enum: CHANNEL_TYPE }, // Only for channel steps; null for others.

    // Step configuration JSON. Schema depends on step_type.
    config: { type: mongoose.Schema.Types.Mixed, default: {} },

    should_stop_on_fail: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationWorkflowStepsSchema.index({ workflow_id: 1, step_order: 1 }, { unique: true });
notificationWorkflowStepsSchema.index({ workflow_id: 1 });

module.exports = mongoose.model("NotificationWorkflowStep", notificationWorkflowStepsSchema);
