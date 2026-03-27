// automation_workflows: Configurable triggered workflows for automated email sequences.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const automationWorkflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    trigger_type: {
      type: String,
      enum: ["list_join", "tag_added", "manual", "event"],
      required: true,
    },
    trigger_config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

automationWorkflowSchema.index({ is_active: 1 });
automationWorkflowSchema.index({ trigger_type: 1 });

module.exports = mongoose.model("AutomationWorkflow", automationWorkflowSchema);
