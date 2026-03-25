// business_schedule_holidays: Dates excluded from business hour calculations.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const businessScheduleHolidaysSchema = new mongoose.Schema(
  {
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessSchedule", required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: false }
);

businessScheduleHolidaysSchema.index({ schedule_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("BusinessScheduleHoliday", businessScheduleHolidaysSchema);
