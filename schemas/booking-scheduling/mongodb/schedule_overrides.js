// schedule_overrides: Date-specific availability overrides for a schedule.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const scheduleOverridesSchema = new mongoose.Schema(
  {
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
    override_date: { type: String, required: true },
    start_time: { type: String, default: null },
    end_time: { type: String, default: null },
    is_available: { type: Boolean, required: true, default: true },
    reason: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

scheduleOverridesSchema.index({ schedule_id: 1, override_date: 1 });

module.exports = mongoose.model("ScheduleOverride", scheduleOverridesSchema);
