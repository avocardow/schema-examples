// business_schedules: Operating hour definitions used by SLA calculations.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const businessSchedulesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    timezone: { type: String, required: true },
    is_default: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("BusinessSchedule", businessSchedulesSchema);
