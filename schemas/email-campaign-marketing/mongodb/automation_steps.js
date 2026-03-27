// automation_steps: Ordered actions within an automation workflow.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const automationStepSchema = new mongoose.Schema(
  {
    workflow_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AutomationWorkflow",
      required: true,
    },
    step_order: {
      type: Number,
      required: true,
    },
    step_type: {
      type: String,
      enum: ["send_email", "delay", "condition"],
      required: true,
    },
    template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

automationStepSchema.index({ workflow_id: 1, step_order: 1 }, { unique: true });
automationStepSchema.index({ template_id: 1 });

module.exports = mongoose.model("AutomationStep", automationStepSchema);
