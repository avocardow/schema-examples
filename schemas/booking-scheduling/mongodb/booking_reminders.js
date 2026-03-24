// booking_reminders: Scheduled reminder notifications for upcoming bookings.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bookingRemindersSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    remind_at: { type: Date, required: true },
    type: {
      type: String,
      enum: ["customer", "provider", "all"],
      required: true,
      default: "customer",
    },
    offset_minutes: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "sent", "failed", "cancelled"],
      required: true,
      default: "pending",
    },
    sent_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

bookingRemindersSchema.index({ booking_id: 1 });
bookingRemindersSchema.index({ status: 1, remind_at: 1 });

module.exports = mongoose.model("BookingReminder", bookingRemindersSchema);
