// pay_schedules: Configurable payroll cadences (weekly, biweekly, semimonthly, monthly).
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const payScheduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    frequency: {
      type: String,
      enum: ["weekly", "biweekly", "semimonthly", "monthly"],
      required: true,
    },

    // Date string that anchors the first pay period (e.g., "2026-01-01").
    anchor_date: { type: String, required: true },

    is_active: { type: Boolean, required: true, default: true },

    description: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

payScheduleSchema.index({ frequency: 1 });
payScheduleSchema.index({ is_active: 1 });

module.exports = mongoose.model("PaySchedule", payScheduleSchema);
