// business_schedule_entries: Daily time windows within a business schedule.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const businessScheduleEntriesSchema = new mongoose.Schema(
  {
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessSchedule", required: true },
    day_of_week: { type: Number, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  { timestamps: false }
);

businessScheduleEntriesSchema.index({ schedule_id: 1, day_of_week: 1 });

module.exports = mongoose.model("BusinessScheduleEntry", businessScheduleEntriesSchema);
