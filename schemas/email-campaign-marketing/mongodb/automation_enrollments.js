// automation_enrollments: Tracks contact progress through automation workflows.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const automationEnrollmentSchema = new mongoose.Schema(
  {
    workflow_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AutomationWorkflow",
      required: true,
    },
    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    current_step_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AutomationStep",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "exited"],
      required: true,
      default: "active",
    },
    enrolled_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completed_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

automationEnrollmentSchema.index({ workflow_id: 1, contact_id: 1 }, { unique: true });
automationEnrollmentSchema.index({ contact_id: 1 });
automationEnrollmentSchema.index({ status: 1 });

module.exports = mongoose.model("AutomationEnrollment", automationEnrollmentSchema);
