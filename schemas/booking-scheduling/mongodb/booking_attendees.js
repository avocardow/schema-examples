// booking_attendees: Tracks individual attendees for group bookings.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bookingAttendeesSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "no_show"],
      required: true,
      default: "confirmed",
    },
    cancelled_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

bookingAttendeesSchema.index({ booking_id: 1 });
bookingAttendeesSchema.index({ user_id: 1 });
bookingAttendeesSchema.index({ email: 1 });

module.exports = mongoose.model("BookingAttendee", bookingAttendeesSchema);
