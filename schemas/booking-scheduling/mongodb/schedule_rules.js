// schedule_rules: Recurring weekly availability windows within a schedule.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const scheduleRulesSchema = new mongoose.Schema(
  {
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
    day_of_week: { type: Number, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

scheduleRulesSchema.index({ schedule_id: 1, day_of_week: 1 });

module.exports = mongoose.model("ScheduleRule", scheduleRulesSchema);
