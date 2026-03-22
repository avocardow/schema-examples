// quiet_hours: Per-user Do Not Disturb schedules with timezone support.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const quietHoursSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // IANA timezone (e.g., "America/New_York"). Quiet hours are evaluated in local time.
    timezone: { type: String, required: true },

    // Local times in HH:MM format. Cross-midnight works naturally: start=22:00, end=08:00.
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },

    // ISO day numbers (1=Monday … 7=Sunday). Example: [1,2,3,4,5] = weekdays only.
    days_of_week: { type: [Number], required: true },

    is_active: { type: Boolean, required: true, default: true },

    // Ad-hoc snooze: temporary DND override. Null = no active snooze.
    snooze_until: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

quietHoursSchema.index({ user_id: 1 });
quietHoursSchema.index({ user_id: 1, is_active: 1 });

module.exports = mongoose.model("QuietHour", quietHoursSchema);
